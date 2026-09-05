# Three tasks that need credentials or authority the agent does not have

Here is what each one is, why it cannot be delegated, and what you actually do.

## The general principle

An automated agent acts with whatever permissions you hand it. These three steps *grant* permissions rather than use them: one hands over a mail account's password, one creates a machine identity that can deploy to production, one is attached to your credit card. An agent that could do them itself would be an agent that could quietly widen its own access. So the prompt has it write the instructions into `functions/README.md` and stop.

Do them in this order. The budget first, because it bounds everything after it. The SMTP secrets second, because the function is useless without them. The GitHub secret last, because it only matters for continuous integration, which is task P1-10.

---

# Step 1: The billing budget

## What you are protecting against

**Blaze** is Google's pay-as-you-go tier. You are billed per function invocation, per gigabyte-second of memory the function occupies while running, and per database read and write. At your traffic that is cents per month. The risk is not normal traffic. It is a bot discovering a public endpoint and calling it a million times, or a bug that makes a function call itself.

## The thing almost everyone gets wrong

A **budget** in Google Cloud is a notification threshold. It is not a spending limit. Setting a budget of twenty euros does not stop spending at twenty euros; it emails you when you cross it, and the meter keeps running. Google offers no hard cap on billing, by design, because silently cutting off a production service is usually worse than an unexpected invoice.

What actually bounds your exposure is the `maxInstances: 3` setting already written into the prompt. An **instance** is one running copy of your function. Serverless platforms scale by starting more copies under load, without limit by default. Capping instances at three means that no matter how many requests arrive, at most three copies exist, each running at most 30 seconds on 256 MB. That turns an unbounded bill into an arithmetically bounded one.

So the budget tells you abuse is happening. The instance cap decides how much it costs while you find out.

## What you do

Open the Google Cloud Console at `console.cloud.google.com`, select project `versicherungsvertreter` in the picker at the top, then Billing, then Budgets & alerts, then Create budget.

Set the scope to that single project rather than the whole billing account, so an alert unambiguously points at this site. Set the amount to a fixed twenty euros per month; that is far above what the site should cost and far below an amount you would not want to notice. Set alert thresholds at 50, 90 and 100 percent of the budget, delivered by email to yourself.

Leave "Connect a Pub/Sub topic to this budget" switched off. That option publishes budget events to a message queue so that code can react to them, and the common recipe is a function that disables billing on the project. Disabling billing stops Cloud Functions and Firestore immediately, which would take your contact form down. For a site at this scale the alert email is the right instrument.

## How you know it worked

The budget appears in the Budgets & alerts list with the project scope shown. Google does not send a confirmation email, so there is nothing else to check.

---

# Step 2: The SMTP secrets

## What SMTP is

**SMTP** is the Simple Mail Transfer Protocol: the protocol servers use to hand email to one another and the one a mail client uses to submit outgoing mail. Your Outlook client speaks it every time you press send. It is unrelated to how mail is read, which uses IMAP.

To send mail from code, your function opens a network connection to a mail server, proves it is allowed to send, and hands over the message. Proving it is allowed is the problem: a function has no person sitting at it, so it needs stored credentials.

## What the five values are

`SMTP_HOST` is the server address to connect to. `SMTP_PORT` is the numbered channel on that server, conventionally 587 for authenticated submission with encryption negotiated after connecting, or 465 for encryption from the first byte. `SMTP_USER` and `SMTP_PASS` are the credentials. `INQUIRY_TO` is the mailbox that receives the inquiries, which is not a credential but belongs with them so it is not baked into the code.

## Where these values come from, and the likely snag

gunnercooke runs Microsoft 365. Historically that meant `smtp.office365.com` on port 587 with a mailbox's own username and password, an arrangement called **basic authentication**: the password travels with each connection.

Microsoft has been retiring basic authentication for SMTP submission for years, because a stored password that grants send rights is a standing risk. Whether it still works on your tenant depends on your tenant's configuration and on where Microsoft's deprecation timeline currently stands. Find out before building around it rather than after.

Test it directly. This connects, negotiates encryption, and reports whether authentication is offered:

```bash
openssl s_client -starttls smtp -crlf -connect smtp.office365.com:587 -quiet
```

If it responds and lists `AUTH LOGIN` among its capabilities, basic authentication is available on that endpoint. If your tenant has it disabled you will get a rejection at the authentication step, not at connection.

Two paths from there. If SMTP authentication is available, ask IT for a dedicated mailbox for this purpose rather than reusing yours, so the stored password grants send rights to one throwaway account and nothing else. If it is not available, you need a **transactional email provider**: a service whose entire purpose is sending application-generated mail, which gives you an API key instead of a mailbox password, plus delivery logs showing whether each message arrived. That is a new data processor handling client inquiry content, so it is an Art. 28 decision and a vendor choice, not something to settle inside a fix pass.

## Storing the values

**Secret Manager** is a Google service that stores a value encrypted and releases it only to code you have authorised. The alternatives leak in specific ways: a password written into the repository is public the moment the repository is, and rewriting git history does not reliably remove it; a password in a `.env` file is a plaintext file that follows the code into build artifacts and backups.

Run these from inside the cloned repository, one at a time. Each prompts for the value, so nothing appears in your shell history.

```bash
firebase functions:secrets:set SMTP_HOST --project versicherungsvertreter
```

```bash
firebase functions:secrets:set SMTP_PORT --project versicherungsvertreter
```

```bash
firebase functions:secrets:set SMTP_USER --project versicherungsvertreter
```

```bash
firebase functions:secrets:set SMTP_PASS --project versicherungsvertreter
```

```bash
firebase functions:secrets:set INQUIRY_TO --project versicherungsvertreter
```

## How you know it worked

This lists the secret names without revealing any value:

```bash
firebase functions:secrets:access SMTP_HOST --project versicherungsvertreter
```

That one does print the value, so use it only for `SMTP_HOST`, which is not sensitive, purely to confirm the mechanism stores and returns what you typed.

The real proof comes later. The prompt requires the agent to show a live `curl` against the deployed function returning 200 and to confirm the mail arrived. If a secret is wrong, the function returns 503 and logs which one, by design, rather than silently succeeding.

---

# Step 3: The GitHub deployment secret

## Why a machine needs its own identity

**Continuous integration** means a machine at GitHub checks out your code, builds it, runs the tests, and deploys the result. That machine cannot log in as you: there is no browser, no password prompt, no second factor.

A **service account** is a non-human identity for exactly this. Google issues one, you grant it a narrow set of permissions, and it authenticates with a **key file**: a JSON document containing a private cryptographic key. Anything holding that file can act as that identity, which is why it never goes in the repository.

A **GitHub repository secret** is an encrypted value stored on GitHub that a workflow run can read but nobody can display, not even you after saving it. That is where the key file goes.

## The permissions it needs

**IAM**, Identity and Access Management, is Google's permission system. A **role** is a named bundle of permissions. This account needs four, and no more:

Firebase Hosting Admin, to publish the site. Cloud Functions Developer, to deploy the contact-form function. Service Account User, because deploying a function means running it as an identity, and this account must be allowed to assign that. Firebase Rules Admin, to publish the Firestore rules that lock the database.

Granting Owner or Editor instead would work and would be a mistake. A leaked key should be able to redeploy your website, not delete your project.

## The easy path

From inside the cloned repository:

```bash
firebase init hosting:github
```

This authenticates as you in a browser, creates the service account, grants it the Hosting role, generates a key, stores it as a GitHub repository secret, and writes starter workflow files. It will ask which repository to configure; answer `sebastianfoerste/versicherungsvertreter_website`.

Two caveats. It grants only the Hosting role, so you add the other three afterwards in the Google Cloud Console under IAM & Admin. And it writes its own workflow files, which the agent will replace with the ones specified in task P1-10; let it, then compare.

## The manual path

If that command cannot authenticate, create the service account under IAM & Admin in the Cloud Console, grant the four roles, generate a JSON key, then add it at github.com/sebastianfoerste/versicherungsvertreter_website, Settings, Secrets and variables, Actions, New repository secret. Name it `FIREBASE_SERVICE_ACCOUNT` and paste the entire JSON file contents as the value.

Delete the downloaded key file from your Mac afterwards. Once it is in GitHub you never need the local copy, and a private key sitting in Downloads is the most common way these leak.

## The better practice, noted and not required

**Workload Identity Federation** lets GitHub prove to Google who it is using a short-lived token tied to the specific repository and branch, with no key file existing anywhere. It removes the long-lived credential entirely. It also takes an afternoon to configure. For a single-page site deployed by one person, the key file is a reasonable trade. It is worth revisiting if this pattern spreads across your repositories.

## How you know it worked

Nothing to verify until CI runs. Task P1-10 requires the agent to push the branch and paste the workflow run URL. If the secret is missing or the roles are wrong, the install, typecheck, test and build steps still pass and only the deploy step fails, which is exactly the diagnostic you want: a red deploy step against green everything else points at permissions, not code.

---

## What is blocking what

The budget blocks nothing; set it first because it is two minutes and it is the only thing watching your card.

The SMTP secrets block the whole of P0-1. The agent can write the function, deploy it, and prove the honeypot, the validation and the rate limiting all behave, but it cannot show a mail arriving. If you cannot resolve the M365 question quickly, hand the prompt over anyway and tell the agent that part (h) applies: the success view must then say "E-Mail vorbereitet" and drop the case reference, so the page stops promising contact it cannot deliver. That is already the honest state of things today, and it is a large improvement over what the page currently claims.

The GitHub secret blocks only the deploy step of P1-10, and only partially.

---

# Step 4: Firestore TTL Retention Policies (Task P0-1(d))

Firestore TTL deletes a document once the named **Timestamp** field lies in the
past. It adds no retention period of its own, and it ignores fields that are
not Timestamps. So a policy on `createdAt` would purge every record within a
day of writing it, and a policy on the numeric `windowStart` would never fire.

The function therefore writes an explicit `expiresAt` Timestamp on every
document: 90 days ahead for `inquiry_log`, 7 days ahead for `ratelimits`, whose
counters are meaningless once their window has closed. Both TTL policies are
set on that field.

1. **`inquiry_log` collection**, field `expiresAt`:
   ```bash
   gcloud firestore fields ttls update expiresAt --collection-group=inquiry_log --enable-ttl --project=versicherungsvertreter
   ```

2. **`ratelimits` collection**, field `expiresAt`:
   ```bash
   gcloud firestore fields ttls update expiresAt --collection-group=ratelimits --enable-ttl --project=versicherungsvertreter
   ```

Verify with:
```bash
gcloud firestore fields ttls list --project=versicherungsvertreter
```

Both policies are already applied for this project (see the pull request that
introduced them). Deletion happens within 24 hours of expiry, not at the
instant; that lag is Firestore's, not the function's.

