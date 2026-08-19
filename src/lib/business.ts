/**
 * Business identity — single source of truth.
 *
 * Kept in one place so the legal operator, support address and contact details
 * can be changed once rather than hunted across Terms, Privacy, About and the
 * wallet page. Boostan is operated independently: nothing here should reference
 * or link to any other business.
 *
 * NOTE ON THE LEGAL OPERATOR
 * A business that takes payments cannot be fully anonymous — consumer
 * protection law, and the KYB checks any card processor will run, both require
 * a named operator. What you *can* control is which name appears. If you
 * incorporate a separate company for Boostan, set `legalName` to it; until
 * then it stays a sole proprietorship and the owner's name is the legal
 * operator by default.
 */

export const BUSINESS = {
  /** Consumer-facing brand. */
  brand: "Boostan",

  /** Incorporated operator named in Terms and Privacy. */
  legalName: "Boostan Digital Marketing Corp.",

  /** Jurisdiction whose law governs the Terms. */
  jurisdiction: "Ontario, Canada",

  /**
   * Support inbox. Must be a domain address, never a personal mailbox:
   * a personal address on a public payments page links the business to an
   * individual and is a standing phishing target.
   */
  supportEmail: "support@boostan.co",

  /** Address funds are sent to for Interac e-transfer deposits. */
  etransferEmail: "payments@boostan.co",

  site: "https://boostan.co",
} as const;
