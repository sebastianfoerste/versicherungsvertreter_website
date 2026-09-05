import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ContactForm from "../src/components/ContactForm";

describe("ContactForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("does not trigger network request and submits nothing when honeypot is filled", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    render(<ContactForm precheck={null} />);

    // Fill honeypot
    const honeypot = screen.getByLabelText("Website");
    fireEvent.change(honeypot, { target: { value: "https://spam-bot.com" } });

    // Fill valid required fields
    fireEvent.change(screen.getByLabelText(/Name \*/), { target: { value: "Max Mustermann" } });
    fireEvent.change(screen.getByLabelText(/E-Mail \*/), { target: { value: "max@example.de" } });
    fireEvent.change(screen.getByLabelText(/Telefon für Rückruf \*/), { target: { value: "+49 30 123456" } });
    fireEvent.click(screen.getByRole("checkbox"));

    // Submit
    fireEvent.click(screen.getByRole("button", { name: "Anfrage senden" }));

    await waitFor(() => {
      // Should show success/preparation view without having called fetch
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    // Verify localStorage has no gc_inquiries
    expect(localStorage.getItem("gc_inquiries")).toBeNull();
  });

  it("validates required fields before submitting", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");

    render(<ContactForm precheck={null} />);

    fireEvent.click(screen.getByRole("button", { name: "Anfrage senden" }));

    expect(await screen.findByText("Bitte geben Sie Ihren vollständigen Namen an.")).toBeDefined();
    expect(screen.getByText("Bitte geben Sie eine gültige E-Mail-Adresse an.")).toBeDefined();
    expect(screen.getByText("Bitte geben Sie eine Telefonnummer für den Rückruf an.")).toBeDefined();
    expect(screen.getByText("Ohne Ihre Einwilligung können wir die Anfrage nicht bearbeiten.")).toBeDefined();
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(localStorage.getItem("gc_inquiries")).toBeNull();
  });

  it("shows success view with server id on 200 response and never writes to gc_inquiries", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: async () => ({ id: "GC-89B-SERVER123" }),
    } as Response);

    render(<ContactForm precheck={null} />);

    fireEvent.change(screen.getByLabelText(/Name \*/), { target: { value: "Max Mustermann" } });
    fireEvent.change(screen.getByLabelText(/E-Mail \*/), { target: { value: "max@example.de" } });
    fireEvent.change(screen.getByLabelText(/Telefon für Rückruf \*/), { target: { value: "+49 30 123456" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: "Anfrage senden" }));

    await waitFor(() => {
      expect(screen.getByText("Vielen Dank für Ihre Anfrage")).toBeDefined();
      expect(screen.getByText("Ihre Referenz: GC-89B-SERVER123")).toBeDefined();
    });

    expect(localStorage.getItem("gc_inquiries")).toBeNull();
  });

  it("shows exact German fallback string on 503 error", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce({
      ok: false,
      status: 503,
      json: async () => ({ error: "delivery_failed" }),
    } as Response);

    render(<ContactForm precheck={null} />);

    fireEvent.change(screen.getByLabelText(/Name \*/), { target: { value: "Max Mustermann" } });
    fireEvent.change(screen.getByLabelText(/E-Mail \*/), { target: { value: "max@example.de" } });
    fireEvent.change(screen.getByLabelText(/Telefon für Rückruf \*/), { target: { value: "+49 30 123456" } });
    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(screen.getByRole("button", { name: "Anfrage senden" }));

    await waitFor(() => {
      expect(
        screen.getByText(
          "Die Anfrage konnte nicht übermittelt werden. Bitte rufen Sie uns an oder senden Sie die vorbereitete E-Mail."
        )
      ).toBeDefined();
    });

    expect(localStorage.getItem("gc_inquiries")).toBeNull();
  });
});
