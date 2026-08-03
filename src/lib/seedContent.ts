export type ArticleSeed = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  tags: string;
  author: string;
  featured: boolean;
  related_site_ids: string;
  published_date: string;
  updated_date: string;
};

export const ARTICLES: ArticleSeed[] = [
  {
    id: "art-pan-card-guide",
    slug: "how-to-apply-for-pan-card",
    title: "How to Apply for a PAN Card: Complete Step-by-Step Guide",
    excerpt:
      "Everything you need to know about applying for a new PAN card in India — eligibility, documents, fees, online application steps, and how to track your application.",
    category: "Income Tax",
    tags: "pan card,tax id,protean,nsdl,income tax",
    author: "GovHub Editorial Team",
    featured: true,
    related_site_ids: "pan-protean,incometax",
    published_date: "2026-05-10",
    updated_date: "2026-07-20",
    content: `A Permanent Account Number, or PAN, is a ten-character alphanumeric identifier issued by the Income Tax Department to anyone who pays tax, opens certain financial accounts, or carries out specific high-value transactions in India. Think of it less as a tax form and more as a financial identity card: banks ask for it, mutual funds ask for it, and the government uses it to link every transaction you make back to a single, unique record.

If you've never applied for one, the process is more straightforward than most people expect, provided you go in prepared. This guide walks through who needs a PAN, what to gather beforehand, and exactly how the application works from start to finish.

## Who needs a PAN card?

Anyone whose income exceeds the basic exemption limit is legally required to hold a PAN and quote it while filing income tax returns. Beyond that, a PAN is practically mandatory for a much wider set of everyday activities: opening a bank account, investing more than a small threshold in mutual funds or shares, buying or selling property above a certain value, applying for a credit or debit card, and even some cash deposits above prescribed limits. Businesses, trusts, and partnerships each need their own PAN as a legal entity, separate from the PAN of the individuals who run them.

Minors can also be issued a PAN, usually applied for by a parent or guardian on their behalf, which is common when a child is a nominee or beneficiary of a financial investment.

## Benefits of having a PAN

A PAN does more than satisfy a legal requirement. It consolidates your financial footprint into a single traceable record, which makes it far easier to file returns accurately, claim refunds, and avoid double taxation on income earned from multiple sources. It also serves as a widely accepted form of photo identification for both government and private processes, from opening a savings account to registering for certain government schemes.

## Eligibility

There's no minimum age or income requirement to apply for a PAN — Indian citizens, non-resident Indians, foreign citizens who do business in India, and even minors are all eligible to apply, each through slightly different application categories (Form 49A for Indian citizens, Form 49AA for foreign citizens and entities).

## Documents required

Every PAN application needs proof of identity, proof of address, and proof of date of birth. In practice, a single document like an Aadhaar card is often sufficient to cover the first two, since it carries both your photograph and a registered address. If you don't have an Aadhaar card, acceptable alternatives include a voter ID, passport, driving licence, or a ration card with your photograph. For date of birth, a birth certificate, matriculation certificate, or passport all work.

If you're applying on behalf of a business entity, you'll instead need the entity's registration certificate — a certificate of incorporation for a company, a partnership deed for a firm, or a trust deed for a trust — along with an office address proof.

## Fees

PAN application fees are modest and depend mainly on whether your communication address is within India or abroad, since the physical card needs to be dispatched by post either way. The exact current fee is published on the application portal at the time you apply, since it's occasionally revised — it's worth checking the fee page on the official portal before you begin rather than relying on a number that might be a year or two out of date.

## Processing time

Once you've submitted a complete application with all documents correctly uploaded or couriered, PAN cards are typically issued within two to three weeks. E-PAN (a digitally signed PDF version of your PAN) is usually available for download within a few days of successful verification, well before the physical card arrives by post — useful if you need to quote your PAN urgently for a transaction.

## Step-by-step application process

**1. Choose your application channel.** PAN applications are processed through two authorised registrars appointed by the Income Tax Department — Protean eGov Technologies (formerly NSDL) and UTI Infrastructure Technology and Services Limited (UTIITSL). Both lead to the same PAN database, so it doesn't matter which one you use; pick whichever site you find easier to navigate.

**2. Fill out Form 49A (or 49AA for foreign applicants).** You'll be asked for your full name, date of birth, address, and contact details, along with your source of income category. Double-check the spelling of your name against your identity documents — a mismatch is one of the most common reasons applications get sent back for correction.

**3. Upload or courier your documents.** For an online application, you'll typically upload scanned copies of your identity, address, and date of birth proofs, along with a passport-size photograph and your signature. If you choose e-KYC using Aadhaar-based OTP verification, the process is largely paperless and faster, since your Aadhaar details are fetched and verified electronically.

**4. Pay the application fee.** Payment is accepted online via debit card, credit card, net banking, or UPI.

**5. Note your acknowledgment number.** After successful submission, you'll receive a 15-digit acknowledgment number — save this. It's what you'll use to track your application status until the PAN is issued.

**6. Complete verification.** Depending on the application mode, you may need to e-sign the form using Aadhaar OTP, or in some cases courier a physically signed copy of the acknowledgment along with your documents to the registrar's office within a specified window.

**7. Download your e-PAN or wait for the physical card.** Once verified, your e-PAN becomes available for download from the registrar's site, and the physical card is dispatched to your registered address.

## Important notes

Holding more than one PAN is a punishable offence under the Income Tax Act, even if the duplicate was issued accidentally. If you've ended up with two PAN cards for any reason, the extra one should be formally surrendered rather than simply discarded. Similarly, if your name, address, or date of birth has changed since your PAN was issued — after marriage, for instance — you can apply for a correction using the same portals rather than applying for a fresh PAN.

## Common mistakes to avoid

A few small errors account for most of the delays and rejections seen in PAN applications. Mismatched names between the application form and supporting documents is the single most common one — even a missing middle name or a different spelling can trigger a rejection. Uploading blurry or partially cropped scans of documents is another frequent issue, as is entering an address that doesn't match the proof submitted. Finally, some applicants unknowingly submit a second application because they assumed their first one had failed, when it was simply still processing — always check your status with the acknowledgment number before reapplying.

## Frequently asked questions

**Is a PAN card mandatory for everyone?** Not everyone is legally required to hold one, but it becomes practically necessary the moment your income crosses the taxable threshold, or you want to open a bank account, invest in securities, or carry out several other common financial transactions.

**Can I apply for a PAN without an Aadhaar card?** Yes. Aadhaar-based e-KYC is the fastest route, but you can still apply using other accepted identity, address, and date-of-birth documents.

**How do I check my PAN application status?** Both Protean and UTIITSL provide a status-tracking page where you enter your acknowledgment number to see the current stage of your application.

**What should I do if I lose my PAN card?** You can apply for a reprint of your existing PAN (not a new one) through the same portals, using your existing PAN number.

**Is e-PAN valid for official use?** Yes — the e-PAN is a digitally signed document issued by the Income Tax Department and is accepted as valid proof of PAN for most purposes, including e-filing your tax return.

To start your application, visit the official PAN services portal linked on GovHub's [Protean eGov — PAN Services](/site/pan-protean) listing.`,
  },
  {
    id: "art-aadhaar-download",
    slug: "how-to-download-aadhaar-card",
    title: "How to Download Your Aadhaar Card Online (e-Aadhaar, mAadhaar & More)",
    excerpt:
      "A complete guide to downloading your Aadhaar card online — using your Aadhaar number, enrolment ID, or virtual ID — plus how to verify it and what to do if you've lost your registered mobile number.",
    category: "Aadhaar & Identity",
    tags: "aadhaar,uidai,e-aadhaar,identity",
    author: "GovHub Editorial Team",
    featured: true,
    related_site_ids: "uidai,digilocker",
    published_date: "2026-04-18",
    updated_date: "2026-07-15",
    content: `Losing a physical Aadhaar card is far less stressful than it used to be, because UIDAI (the Unique Identification Authority of India) lets you download a fully valid electronic copy — called an e-Aadhaar — in a few minutes from home. This guide covers every legitimate way to get a copy of your Aadhaar, what each method requires, and how to confirm the document you've downloaded is genuine.

## What is e-Aadhaar, and is it as valid as the physical card?

e-Aadhaar is a password-protected PDF version of your Aadhaar card, digitally signed by UIDAI. It carries the same demographic details, photograph, and QR code as the physical card, and it's accepted as equally valid proof of identity and address across banks, telecom providers, and government offices. In practice, many people never bother reprinting the plastic card once they have a downloaded copy saved on their phone or laptop.

## Before you start: what you'll need

You'll need one of three identifiers to download your Aadhaar: your 12-digit Aadhaar number, your 28-digit Enrolment ID (found on the acknowledgment slip you received when you first enrolled), or your 16-digit Virtual ID (a temporary, revocable substitute for your Aadhaar number that you can generate yourself for extra privacy). You'll also need access to the mobile number registered with your Aadhaar, since UIDAI sends a one-time password to that number to verify it's really you.

## Step-by-step: downloading e-Aadhaar via the UIDAI website

**1. Go to the official UIDAI portal** and find the "Download Aadhaar" service under the "My Aadhaar" section.

**2. Choose your identifier type** — Aadhaar Number, Enrolment ID, or Virtual ID — and enter the corresponding number along with your full name and pin code as shown in your Aadhaar record.

**3. Enter the security captcha** and request an OTP. The OTP is sent to your Aadhaar-registered mobile number.

**4. Enter the OTP** within the validity window and submit.

**5. Download the PDF.** The file is password-protected — the password is a combination of the first four letters of your name (in capitals) and your year of birth (YYYY), for example RAHU1998 for someone named Rahul born in 1998.

## Downloading via mAadhaar app

UIDAI's official mAadhaar mobile app lets you carry a verified digital copy of your Aadhaar on your phone at all times, without needing a fresh download each time. After installing the app and completing the one-time registration with your Aadhaar-linked mobile number, your profile is fetched and stored securely on the device, available offline and shareable as a QR code when someone needs to verify it.

## What if you don't have your mobile number handy — or it's changed?

If your registered mobile number is no longer active or accessible, you can't retrieve the OTP-based download through the standard route. In that case, you'll need to first visit a nearby Aadhaar Seva Kendra or permanent enrolment centre to update your mobile number on record, after which the standard download process will work again. There's no way to bypass mobile verification for a fresh download, since it's the core security check protecting your Aadhaar data.

## How to verify a downloaded Aadhaar is genuine

Every Aadhaar, whether physical or digital, carries a QR code that can be scanned using UIDAI's official QR code reader tool or the mAadhaar app to instantly display the demographic details encoded in it — a quick way to confirm a copy hasn't been tampered with. e-Aadhaar PDFs are also digitally signed, and this signature can be verified using any standard PDF reader that supports signature validation.

## Common mistakes to avoid

The most common snag people run into is simply forgetting the PDF password format — it's not your everyday password, and re-attempts can be limited. Another frequent issue is trying to download using an old mobile number that's no longer linked to the Aadhaar record; the OTP will silently fail to arrive rather than showing an obvious error, which confuses a lot of first-time downloaders into thinking the website is broken. Finally, be cautious of third-party websites or apps promising a "faster" Aadhaar download — the only trustworthy sources are UIDAI's own portal and the official mAadhaar app.

## Frequently asked questions

**Can I download Aadhaar without my registered mobile number?** No, not directly — you'll need to update your mobile number at an enrolment centre first.

**Is the downloaded e-Aadhaar accepted everywhere the physical card is?** Yes, e-Aadhaar carries the same legal validity as the physical card for identity and address verification purposes.

**How do I find my Enrolment ID if I've lost the acknowledgment slip?** UIDAI's portal has a separate "Retrieve Lost or Forgotten EID/UID" service that sends your Aadhaar or Enrolment number to your registered mobile number or email.

**What's the difference between Aadhaar Number and Virtual ID?** A Virtual ID is a temporary, revocable 16-digit number you can generate to share instead of your actual Aadhaar number, useful when you want to limit how widely your permanent Aadhaar number is exposed.

**Can I print the downloaded e-Aadhaar myself?** Yes, a black-and-white or colour printout of the e-Aadhaar PDF is accepted as valid — there's no requirement to get a laminated card from UIDAI unless you specifically want one.

You can start your download directly on the official [UIDAI — Aadhaar](/site/uidai) portal, or manage all your Aadhaar-linked documents through [DigiLocker](/site/digilocker).`,
  },
  {
    id: "art-passport-guide",
    slug: "passport-application-guide-india",
    title: "Passport Application Guide: Fresh Applications, Renewals & Tatkal",
    excerpt:
      "How to apply for a new Indian passport or renew an existing one — eligibility, documents, fee categories, the Tatkal fast-track option, and what to expect at your appointment.",
    category: "Passport",
    tags: "passport,passport seva,tatkal,visa,travel",
    author: "GovHub Editorial Team",
    featured: true,
    related_site_ids: "passport",
    published_date: "2026-03-22",
    updated_date: "2026-07-18",
    content: `Applying for an Indian passport used to mean long queues and uncertain waiting times. The Passport Seva system has since moved almost the entire process online, with in-person visits reduced to a single, scheduled appointment at a Passport Seva Kendra (PSK) or Post Office Passport Seva Kendra (POPSK) for document verification and biometric capture. This guide walks through fresh applications, renewals, and the Tatkal fast-track scheme.

## Fresh application vs. renewal — which do you need?

A fresh application applies if you've never held an Indian passport before, or if your previous passport has been expired for more than a specified number of years (at which point it's typically treated as a fresh application rather than a renewal, with correspondingly different document requirements). A renewal applies if your existing passport is valid or has recently expired, and you're essentially requesting a new booklet with updated validity, sometimes alongside changes like an address update.

## Eligibility

Any Indian citizen can apply for a passport, and there's no minimum age — even infants are issued their own passport rather than being added to a parent's. Minors need consent and supporting documents from a parent or legal guardian. If you have outstanding legal matters such as a pending criminal case, you may still be eligible but could be asked for additional clearance documents.

## Documents required

Standard documents include proof of address (utility bills, Aadhaar, or bank statements, among others), proof of date of birth (birth certificate, or matriculation certificate for older applicants), and a recent passport-size photograph, though photographs are now typically captured live at the PSK rather than submitted separately. Applicants with an existing passport being renewed will also need the original passport for submission. If you're applying using Aadhaar as your primary address proof, the process is often smoother, since the details can be validated electronically.

Additional documents may be requested for specific situations — a name-change gazette notification if your name has changed since your last passport, an annexure declaration for certain professions, or an educational certificate in some minor-related cases.

## Fees

Passport fees vary based on booklet type (36-page or 60-page), applicant age, and whether you're applying under Normal or Tatkal scheme, with Tatkal carrying a significant additional premium in exchange for a much faster appointment and issuance timeline. Because fee structures are revised periodically, the exact current amount is best confirmed on the official fee calculator on the Passport Seva portal before you book your appointment.

## Processing time

Under the Normal scheme, passports are typically issued within a couple of weeks of a successful police verification and appointment, though this can vary by city and applicant category. Under Tatkal, appointments are available much sooner after application (often within a day or two), and the passport itself can be issued within about a week, provided there are no complications with your documents or police verification.

## Step-by-step application process

**1. Register on the Passport Seva portal.** Create an account using your email address if you don't already have one.

**2. Fill the online application form.** You'll provide personal details, address history, family details, and your preferred PSK location.

**3. Pay the applicable fee online.** Payment is accepted via net banking, credit/debit card, or UPI directly through the portal.

**4. Schedule your appointment.** Once payment is confirmed, available appointment slots at your chosen PSK or POPSK are shown — book the earliest one that works for you.

**5. Visit the PSK on your appointment date.** Bring your original documents (not just photocopies) along with your appointment confirmation. You'll go through document verification, biometric capture (photograph and fingerprints), and a brief interview with a passport officer.

**6. Police verification.** For most fresh applicants, a local police verification is conducted either before or after passport issuance, depending on your category and location — Tatkal applicants under certain conditions may receive the passport with post-issuance verification.

**7. Track and receive your passport.** Once verification is complete, the passport is printed and dispatched by post to your registered address. You can track status throughout using your application reference number on the Passport Seva portal.

## Tatkal scheme: what to know

Tatkal is designed for applicants who need a passport urgently and are willing to pay a premium for a much faster process. It generally requires an additional verification certificate or supporting documents to establish identity quickly, since the standard pre-verification steps are compressed. Not every applicant is eligible for Tatkal in every circumstance — certain categories, such as applicants with an unclear address history, may still be redirected toward the Normal scheme with post-issuance police verification.

## Important notes

Carry originals of every document to your PSK appointment, not just uploaded scans — verification is done against the physical documents on the spot, and missing originals is one of the most common reasons appointments have to be rescheduled. If you're changing your address or name as part of a renewal, be ready with the specific supporting documents for that change (an address proof dated after your move, or a gazette notification for a name change), since these aren't optional add-ons.

## Common mistakes to avoid

Booking an appointment before double-checking every field in the online form is a frequent source of delay, since certain details can't be edited after an appointment is scheduled without cancelling and restarting the process. Another common issue is applicants assuming their Aadhaar address is automatically pulled into the passport application — it isn't; you still need to enter and verify your current address yourself. Finally, missing your scheduled appointment without rescheduling in advance can mean losing the appointment fee and needing to rebook a fresh slot, which may be significantly delayed depending on demand at your PSK.

## Frequently asked questions

**How long is an Indian passport valid for?** Passports for adults are typically issued with ten-year validity, while passports for minors are issued with shorter validity, generally reissued as the child grows.

**Can I apply for a passport in a city different from my current address?** Yes, PSK appointments can generally be booked based on your convenience rather than strictly your registered address, though your application will reflect your actual current address.

**What happens if my police verification is delayed?** Passport issuance can be held up pending verification; if it's taking unusually long, you can raise a grievance through the Passport Seva portal's grievance redressal section.

**Do I need to submit my educational certificates?** Generally no, unless requested for a specific annexure or minor-related declaration — standard adult applications typically don't require them.

**Can I track my passport status online?** Yes, the Passport Seva portal provides real-time status tracking using your application reference number throughout the process, from application to dispatch.

Start your application on the official [Passport Seva](/site/passport) portal.`,
  },
  {
    id: "art-driving-licence-guide",
    slug: "driving-licence-application-guide",
    title: "Driving Licence Guide: Learner's Licence, Permanent DL & Renewal",
    excerpt:
      "A practical walkthrough of getting a driving licence in India — from the learner's licence test to the permanent licence, plus how renewals and address updates work through Parivahan Sewa.",
    category: "Driving Licence",
    tags: "driving licence,parivahan,rto,learner licence,dl renewal",
    author: "GovHub Editorial Team",
    featured: false,
    related_site_ids: "parivahan",
    published_date: "2026-02-14",
    updated_date: "2026-07-10",
    content: `Getting a driving licence in India happens in two stages: a Learner's Licence (LL) first, followed by a Permanent Driving Licence (DL) after a mandatory waiting period and a practical driving test. The Parivahan Sewa portal has digitised most of this process, letting you book slots, fill forms, and in many states even take the learner's test online. Here's how the whole journey works, plus what renewals and address changes involve later on.

## Learner's Licence: the first step

A Learner's Licence is a temporary permit that allows you to practise driving on public roads, provided you're accompanied appropriately (and display an "L" sign, depending on your state's rules) while you build up experience ahead of your permanent licence test.

**Eligibility:** The minimum age for a learner's licence for a gearless two-wheeler is generally lower than for a car or geared vehicle, and applicants under 18 need parental or guardian consent for certain vehicle categories. You'll need to be able to pass a basic vision and road-sign knowledge test as part of the application.

**Documents required:** Proof of age (birth certificate, PAN, or a school-leaving certificate, among accepted options), proof of address (Aadhaar, utility bill, or similar), and a recent passport-size photograph. A simple medical certificate may be required for certain vehicle categories or age groups.

**Process:**
1. Register on the Parivahan Sewa portal and select your state's RTO services.
2. Fill in the learner's licence application (Form 2) with your personal details and the vehicle class you want to be tested for (two-wheeler, light motor vehicle, etc.).
3. Upload your documents and pay the applicable fee online.
4. Book a slot for the learner's licence test — in most states, this is now a computer-based test on road signs and traffic rules, taken at the RTO or in some cases online from home.
5. Once you pass, your Learner's Licence is issued, valid for a limited period (commonly six months), during which you're expected to practise ahead of the permanent licence test.

## Permanent Driving Licence: after the learner's period

You can apply for a Permanent Driving Licence after a minimum waiting period from the date your learner's licence was issued (commonly around 30 days, and before the learner's licence expires).

**Process:**
1. Log back into the Parivahan portal and apply for the permanent DL (Form 4), linking it to your existing learner's licence number.
2. Book a slot for the driving test at your RTO.
3. Attend the practical driving test, where an RTO official evaluates your control of the vehicle, understanding of road rules, and basic manoeuvres like reverse parking or hill starts, depending on the vehicle class.
4. If you pass, your permanent Driving Licence is processed and typically dispatched by post to your registered address, usually within a couple of weeks. A digital copy is generally made available on the DigiLocker-linked mParivahan app sooner than the physical card arrives.

## Fees

Fees apply separately for the learner's licence test, the permanent licence application, and the driving test itself, and vary somewhat by state since RTOs are state-administered. The Parivahan portal shows the applicable fee breakdown for your state before you make payment.

## Renewing an existing driving licence

Driving licences need periodic renewal — the standard validity period is typically around 20 years for non-transport vehicles, or until the holder turns 40 if issued after a certain age, after which renewal is needed more frequently. It's worth applying for renewal before your existing licence expires; a lapsed licence beyond a certain grace period can require a fresh test rather than a simple renewal.

**Renewal process:**
1. Apply on the Parivahan portal under DL renewal services, entering your existing licence number.
2. Upload a recent photograph and, for renewals after a certain age, a medical fitness certificate.
3. Pay the renewal fee.
4. In many cases, renewal doesn't require an in-person RTO visit at all if your documents are in order — though some states may still call for a biometric update.

## Important notes

Your Learner's Licence has a fixed validity window, and if it expires before you complete your permanent licence test, you'll need to reapply for a fresh learner's licence rather than simply extending the old one. If you move to a different state, driving licences issued in India remain valid nationwide, so you generally don't need a new licence — you would instead apply for an address change on your existing licence if you want your records updated, which is a separate, simpler process than a fresh application.

## Common mistakes to avoid

Booking a driving test appointment before you're genuinely road-ready is one of the most common reasons for failing the practical test and having to rebook — there's usually a cooldown period before you can retake it. Letting your learner's licence lapse without tracking its expiry date is another frequent issue, since it resets the process back to square one. Finally, some applicants assume the mParivahan app's digital DL alone is sufficient at all times — while widely accepted, it's worth carrying your physical licence as well until you've confirmed local enforcement practices accept the digital copy in your state.

## Frequently asked questions

**Can I apply for both two-wheeler and four-wheeler licences together?** Yes, you can apply for multiple vehicle classes on a single learner's licence application, and take the corresponding tests for each.

**Is the learner's licence test conducted online?** In many states, yes — a computer-based test on traffic rules and road signs, though this varies by state, so check your state's specific Parivahan process.

**What happens if I fail the permanent licence driving test?** You can rebook a fresh slot after a state-specified cooldown period, generally without needing to reapply for a new learner's licence as long as it's still valid.

**Do I need to visit the RTO in person for DL renewal?** Often not, especially for straightforward renewals without an age-related medical requirement — many states allow fully online renewal.

**How do I update my address on my driving licence?** Parivahan Sewa has a dedicated "Change of Address" service under DL-related services, which typically requires your updated address proof.

Start your application on the official [Parivahan Sewa](/site/parivahan) portal.`,
  },
  {
    id: "art-pmkisan-guide",
    slug: "pm-kisan-registration-guide",
    title: "PM-KISAN Registration Guide: Eligibility, Documents & Instalment Status",
    excerpt:
      "How farmers can register for PM-KISAN income support, who qualifies, what documents are needed, and how to check your instalment status or fix a payment failure.",
    category: "Agriculture",
    tags: "pm kisan,farmer,subsidy,agriculture",
    author: "GovHub Editorial Team",
    featured: false,
    related_site_ids: "pmkisan,nrega",
    published_date: "2026-06-01",
    updated_date: "2026-07-25",
    content: `PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) is a central government income support scheme that provides eligible farmer families with direct cash transfers, paid in instalments straight into their bank accounts. Because it's a direct benefit transfer scheme, getting your registration details exactly right matters — even a small mismatch between your Aadhaar and bank records can hold up a payment. Here's how registration, eligibility, and instalment tracking work.

## What is PM-KISAN?

The scheme is designed to supplement the financial needs of farmer families for agricultural inputs and household needs, paid out in three equal instalments over the course of a year directly into the registered bank account of the beneficiary — no intermediaries involved, which is the core idea behind it being a Direct Benefit Transfer (DBT) scheme.

## Eligibility

Broadly, the scheme is aimed at farmer families that own cultivable land, subject to certain exclusion criteria — for instance, institutional landholders, and individuals meeting specific higher-income or professional categories (such as serving or retired government employees above certain pay levels, income tax payers, and professionals like doctors, engineers, and lawyers registered with their professional bodies) are generally excluded. Land ownership records as they stood at a specified cutoff date are typically used to determine eligibility, so it's worth checking the current eligibility criteria on the official portal, since exclusion categories are defined precisely and matter for your registration.

## Documents required

You'll need your Aadhaar card, land ownership documents (records of rights, tenancy records, or equivalent land records as maintained by your state), and your bank account details, since the account needs to be linked correctly for the transfer to go through. Aadhaar-bank account linkage and seeding is one of the most important steps, since payments are routed based on this link.

## Step-by-step registration process

**1. Visit the PM-KISAN portal** and look for the "New Farmer Registration" option.

**2. Choose Rural or Urban farmer registration**, based on where your land is located.

**3. Enter your Aadhaar number** and state, then proceed through the OTP-based verification.

**4. Fill in your personal and land details**, including bank account information exactly as it appears on your bank passbook or statement — even small discrepancies here are a common reason for payment failures later.

**5. Submit for verification.** Your application goes to your state's designated agricultural or revenue officials for verification against land records before it's approved.

**6. Track your status** using your registration number or Aadhaar number on the portal's beneficiary status page.

Alternatively, registration can also be done by visiting your local Common Service Centre (CSC), which can be a more accessible route for farmers less comfortable with the online process, though a small facilitation fee may apply at the CSC.

## Checking your instalment status

The PM-KISAN portal has a dedicated "Beneficiary Status" page where you can check your instalment history using your Aadhaar number, mobile number, or bank account number. It shows whether each instalment was successfully credited, and if not, often provides a reason code (such as an Aadhaar-bank seeding mismatch, an incomplete eKYC, or a land record verification pending status).

## Common reasons for a failed or delayed instalment

The most frequent cause is an eKYC that hasn't been completed — PM-KISAN requires periodic eKYC verification (via OTP, biometric, or face authentication through the app) to keep your record active, and instalments are held until this is done. Aadhaar-bank seeding issues, where your Aadhaar isn't correctly linked to the specific bank account registered for PM-KISAN, is another common cause. Land record verification pending at the state level can also delay a first instalment for new registrations, since state officials need to confirm the land details you've submitted.

## Important notes

Keep your mobile number linked to Aadhaar up to date, since OTP-based eKYC depends on it. If your bank account is closed or changed, update the new account details on the PM-KISAN portal promptly — instalments won't automatically follow an old account to a new one.

## Common mistakes to avoid

Entering bank account details with a small typo, or details for an account that isn't in the applicant's own name, is one of the most common and frustrating errors, since it silently causes payment failures rather than an upfront rejection. Skipping the mandatory eKYC step is another frequent oversight — many farmers register successfully but then don't realise their instalments are on hold until they complete eKYC. Finally, some applicants under one of the exclusion categories (such as being an income tax payer) mistakenly register anyway, which typically results in the application being rejected during verification, or benefits being recovered later if discovered after payment.

## Frequently asked questions

**How much does PM-KISAN pay, and how often?** The scheme pays a fixed annual amount split into three equal instalments; the exact current amount is published on the official PM-KISAN portal, since scheme parameters can be revised.

**Can tenant farmers register for PM-KISAN?** Eligibility is generally tied to land ownership records rather than tenancy alone, though some states have specific provisions — check your state's current guidelines on the portal.

**What is eKYC, and why is it mandatory?** eKYC is a periodic identity re-verification step (via Aadhaar OTP, biometric, or face authentication) required to keep your PM-KISAN record active and prevent duplicate or fraudulent registrations.

**How do I correct my bank account details after registration?** The PM-KISAN portal has a farmer corner where registered beneficiaries can update their bank account and other details, subject to fresh verification.

**Who do I contact if my instalment hasn't arrived despite everything looking correct?** The portal provides a grievance/helpline section, and your local agriculture department office can also help investigate a specific stuck instalment.

Check your status or register on the official [PM-KISAN](/site/pmkisan) portal.`,
  },
];

export type ServiceDetailSeed = {
  site_id: string;
  overview: string;
  benefits: string;
  eligibility: string;
  documents: string;
  fees: string;
  processing_time: string;
  steps: string;
  important_notes: string;
  common_mistakes: string;
  faqs: string;
};

export const SERVICE_DETAILS: ServiceDetailSeed[] = [
  {
    site_id: "uidai",
    overview:
      "UIDAI (Unique Identification Authority of India) issues Aadhaar — a 12-digit unique identity number linked to your biometrics and demographic details. It has become the most widely used identity document in the country, accepted across banking, telecom, and most government services.",
    benefits:
      "- A single, widely accepted proof of identity and address\n- Enables paperless, instant e-KYC for banks, telecom, and other services\n- Free enrolment and updates at designated centres\n- Downloadable digital copy (e-Aadhaar) available anytime\n- Links to DigiLocker for storing other documents digitally",
    eligibility:
      "- Available to all residents of India, including children (with a slightly different enrolment process for those under 5)\n- No minimum stay requirement — even newly settled residents can enrol\n- One Aadhaar per person; duplicate enrolment is not permitted",
    documents:
      "- Proof of identity (passport, PAN, voter ID, or similar)\n- Proof of address (utility bill, bank statement, rent agreement, or similar)\n- Proof of date of birth for new enrolments\n- A recent photograph (captured at the enrolment centre)",
    fees: "Aadhaar enrolment is free. A nominal fee applies for certain update requests (such as biometric updates) and for a fresh PVC card reprint, which is optional.",
    processing_time:
      "Enrolment is completed the same day at the centre. The Aadhaar number is typically generated and the letter dispatched within a few weeks; e-Aadhaar can usually be downloaded sooner once the number is generated.",
    steps:
      "- Locate your nearest Aadhaar Enrolment Centre using the UIDAI locator tool\n- Carry your identity and address proof documents\n- Fill the enrolment form at the centre and provide biometrics (fingerprints, iris scan, and photograph)\n- Note your enrolment ID from the acknowledgment slip\n- Track status online using your enrolment ID\n- Download e-Aadhaar once your Aadhaar number is generated",
    important_notes:
      "Keep your mobile number linked and updated, since OTP-based verification for downloads and e-KYC depends on it. Aadhaar is not proof of citizenship — it is a proof of identity and residency only.",
    common_mistakes:
      "- Entering a name that doesn't match supporting documents exactly\n- Forgetting to update the linked mobile number after changing it, which later blocks OTP-based downloads\n- Assuming a photocopy without the QR code is sufficient for verification purposes",
    faqs:
      "Q: Is Aadhaar mandatory?\nA: Aadhaar is voluntary for residents, though it has become practically necessary for many services due to widespread e-KYC requirements.\n\nQ: Can NRIs get an Aadhaar card?\nA: Yes, NRIs with a valid Indian passport can apply for Aadhaar without the standard 182-day residency requirement that applies to other categories.\n\nQ: What if my biometrics don't match during verification?\nA: You can visit an enrolment centre to update your biometrics; occasional mismatches can happen due to age or manual work affecting fingerprints.",
  },
  {
    site_id: "incometax",
    overview:
      "The Income Tax e-Filing portal is where individuals and businesses file their annual income tax returns, check refund status, respond to tax notices, and manage PAN-linked tax records — the primary digital interface between taxpayers and the Income Tax Department.",
    benefits:
      "- File returns entirely online without visiting a tax office\n- Pre-filled return forms using data already available with the department\n- Real-time refund status tracking\n- Digital record of past filings and assessment history\n- Faster refund processing for e-verified returns",
    eligibility:
      "- Anyone with income above the basic exemption limit is required to file\n- Filing may also be required in specific situations even below the threshold, such as high-value transactions or foreign asset holdings\n- Both individuals and entities (companies, firms, trusts) file through the same portal under their respective categories",
    documents:
      "- PAN and Aadhaar (linked)\n- Form 16 from your employer, if salaried\n- Bank statements and interest certificates\n- Investment proofs for claiming deductions\n- Capital gains statements, if applicable",
    fees: "Filing an income tax return itself is free. Late filing beyond the due date can attract a fee under the Income Tax Act, and interest may apply on any tax due.",
    processing_time:
      "Returns are typically processed within a few weeks to a couple of months after e-verification, with refunds (where applicable) credited directly to the bank account linked in the return.",
    steps:
      "- Register or log in on the e-filing portal using your PAN\n- Select the applicable Income Tax Return (ITR) form based on your income sources\n- Fill in or review the pre-filled details, including income, deductions, and tax paid\n- Compute tax payable or refund due\n- Submit the return and complete e-verification (via Aadhaar OTP, net banking, or other supported methods)\n- Track processing and refund status from your dashboard",
    important_notes:
      "A return isn't considered validly filed until it's e-verified (or a signed physical acknowledgment is sent, for the rare cases that require it) — many people file but forget this final step, which can invalidate the return.",
    common_mistakes:
      "- Choosing the wrong ITR form for your income category\n- Forgetting to e-verify after submission\n- Missing income from smaller sources like savings account interest\n- Not reconciling Form 26AS/AIS with the return before submission",
    faqs:
      "Q: What happens if I miss the filing deadline?\nA: You can still file a belated return before the extended deadline set for late filings, though a late fee and interest may apply.\n\nQ: How do I check my refund status?\nA: The e-filing portal has a dedicated refund status section, and refunds can also be tracked via the NSDL/Protean refund status page using your PAN.\n\nQ: Do I need a chartered accountant to file my return?\nA: Not necessarily for straightforward salaried returns, though it can help for complex income sources like capital gains or business income.",
  },
  {
    site_id: "passport",
    overview:
      "Passport Seva is the Ministry of External Affairs' digital platform for applying for a new Indian passport, renewing an existing one, or requesting related services like a police clearance certificate — coordinating appointments at Passport Seva Kendras and Post Office PSKs nationwide.",
    benefits:
      "- End-to-end online application with minimal in-person visits\n- Real-time appointment booking at your preferred centre\n- Status tracking from application to dispatch\n- Tatkal fast-track option for urgent needs\n- Integration with police verification for a smoother process",
    eligibility:
      "- Any Indian citizen, regardless of age, can apply\n- Minors require parental or guardian consent and documentation\n- Applicants with pending legal matters may still apply, subject to additional clearance in some cases",
    documents:
      "- Proof of address (Aadhaar, utility bill, or similar)\n- Proof of date of birth (birth certificate or equivalent)\n- Existing passport, for renewals\n- Additional annexures for specific situations (name change, minor applications, etc.)",
    fees: "Fees vary by booklet type, applicant age, and Normal vs. Tatkal scheme — check the official fee calculator on the portal before applying.",
    processing_time:
      "Normal scheme applications are typically processed within a couple of weeks after appointment and verification; Tatkal applications are significantly faster, often within about a week.",
    steps:
      "- Register on the Passport Seva portal\n- Fill the online application form with personal and address details\n- Pay the fee and book an appointment at your chosen PSK/POPSK\n- Visit the centre with original documents for verification and biometric capture\n- Complete police verification (timing depends on application category)\n- Track and receive your passport by post",
    important_notes:
      "Always carry original documents to your appointment — verification is done against physical originals, not just uploaded scans.",
    common_mistakes:
      "- Booking an appointment before finalising all form details, since some fields can't be edited afterward\n- Assuming Aadhaar address is auto-filled into the application\n- Missing a scheduled appointment without rescheduling in advance",
    faqs:
      "Q: How long is a passport valid?\nA: Adult passports are typically issued with ten-year validity; minors receive shorter validity, generally renewed as they grow.\n\nQ: Can I choose any PSK regardless of my address?\nA: Yes, appointments can generally be booked at any PSK for convenience, though your application reflects your actual address.\n\nQ: What is Tatkal, and who is eligible?\nA: Tatkal is a fast-track scheme for urgent passport needs at a higher fee, generally requiring additional identity verification since standard pre-checks are compressed.",
  },
  {
    site_id: "parivahan",
    overview:
      "Parivahan Sewa is the national platform connecting India's state Regional Transport Offices (RTOs), used for driving licence applications and renewals, vehicle registration, road tax payment, and related transport services.",
    benefits:
      "- Book learner's and permanent licence tests online\n- Track driving licence and vehicle registration status\n- Digital driving licence access via the mParivahan app\n- Pay road tax and related fees online\n- Apply for address or detail changes without always needing an RTO visit",
    eligibility:
      "- Minimum age requirements vary by vehicle category (generally lower for gearless two-wheelers than for cars)\n- Applicants under 18 need parental or guardian consent for certain categories\n- A valid learner's licence is required before applying for a permanent licence",
    documents:
      "- Proof of age and address (Aadhaar, PAN, or equivalent)\n- Recent photograph\n- Medical certificate, for certain vehicle categories or renewals after a certain age\n- Existing learner's licence, when applying for a permanent licence",
    fees: "Fees apply separately for the learner's test, permanent licence application, and driving test, and vary by state — the Parivahan portal shows the applicable breakdown for your state.",
    processing_time:
      "Learner's licences are typically issued same-day after passing the test. Permanent licences are generally dispatched within a couple of weeks of passing the driving test.",
    steps:
      "- Register on the Parivahan Sewa portal and select your state\n- Apply for a Learner's Licence (Form 2) and book a test slot\n- Pass the learner's test to receive your LL\n- After the minimum waiting period, apply for a Permanent Licence (Form 4)\n- Book and attend the practical driving test at your RTO\n- Receive your licence by post, with a digital copy available via mParivahan",
    important_notes:
      "Your Learner's Licence has a limited validity window — if it expires before you complete the permanent licence test, you'll need to reapply from the start.",
    common_mistakes:
      "- Booking the driving test before being genuinely road-ready, risking a failed attempt and a cooldown before retesting\n- Letting the learner's licence lapse without tracking its expiry\n- Assuming the digital licence alone is sufficient everywhere without checking local practice",
    faqs:
      "Q: Is the learner's licence test conducted online?\nA: In many states, yes — a computer-based test on traffic rules and signs, though this varies by state.\n\nQ: Do I need to visit the RTO for a licence renewal?\nA: Often not for straightforward renewals, though age-related medical requirements may still need an in-person step in some states.\n\nQ: How do I update my address on my driving licence?\nA: Use the dedicated Change of Address service under DL-related services on the Parivahan portal.",
  },
  {
    site_id: "pmkisan",
    overview:
      "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi) is a central government scheme providing direct income support to eligible farmer families, paid in three equal instalments per year straight into their registered bank account.",
    benefits:
      "- Direct bank transfer with no intermediaries\n- Predictable, scheduled instalments\n- Simple online registration and status tracking\n- Supports agricultural input and household needs for eligible farmers",
    eligibility:
      "- Farmer families owning cultivable land, per state land records\n- Subject to exclusion categories such as institutional landholders, income tax payers, and certain government/professional categories\n- Eligibility is verified against land records as of a specified cutoff",
    documents:
      "- Aadhaar card\n- Land ownership records (as maintained by the state)\n- Bank account details, correctly linked to Aadhaar",
    fees: "Registration is free. A small facilitation fee may apply only if registering through a Common Service Centre rather than directly online.",
    processing_time:
      "Verification against land records typically takes a few weeks for new registrations; once approved, instalments follow the scheme's regular payment cycle.",
    steps:
      "- Visit the PM-KISAN portal and select New Farmer Registration\n- Choose Rural or Urban registration based on your land location\n- Verify your Aadhaar via OTP\n- Enter personal, land, and bank details carefully\n- Submit for state-level verification\n- Track status and instalment history using your registration number",
    important_notes:
      "Periodic eKYC (via OTP, biometric, or face authentication) is mandatory to keep your record active — instalments are held for accounts with pending eKYC.",
    common_mistakes:
      "- Entering bank account details with typos or in a name other than the applicant's own\n- Skipping the mandatory eKYC step after registration\n- Registering despite falling under an exclusion category, leading to rejection or later recovery of paid amounts",
    faqs:
      "Q: How is PM-KISAN paid out?\nA: In three equal instalments per year, directly into the beneficiary's registered bank account.\n\nQ: What is eKYC and why is it required?\nA: A periodic identity re-verification step required to keep your record active and prevent duplicate or fraudulent registrations.\n\nQ: Can tenant farmers register?\nA: Eligibility is generally tied to land ownership records rather than tenancy alone, though some states have specific provisions worth checking on the portal.",
  },
];

export const FAQ_ITEMS: { question: string; answer: string; sort_order: number }[] = [
  {
    question: "Is GovHub an official government website?",
    answer:
      "No. GovHub is an independent directory built to help people find the correct official website faster. It is not affiliated with, endorsed by, or operated by any government authority.",
    sort_order: 1,
  },
  {
    question: "How do you verify a listing?",
    answer:
      "Each listing's URL is checked against the domain published by the relevant ministry or department before it is added, and rechecked periodically. You can see the last verification date on every listing.",
    sort_order: 2,
  },
  {
    question: "I found a broken or suspicious link. What do I do?",
    answer:
      'Open the listing and use the "Report link" option, or reach us through the Contact page with the listing name and what you noticed.',
    sort_order: 3,
  },
  {
    question: "Can I suggest a website that's missing?",
    answer: "Yes — use the Suggest a Website form. Every suggestion is checked before it's published.",
    sort_order: 4,
  },
  {
    question: "Do I need an account to use GovHub?",
    answer:
      "No account is required to search or browse. Favourites are kept for your current browser session using a private cookie, not an account.",
    sort_order: 5,
  },
  {
    question: "Does GovHub charge for any service?",
    answer:
      "No. GovHub itself is completely free to use. Any fees you see mentioned on a service page are official government fees, paid directly on the official portal, never to GovHub.",
    sort_order: 6,
  },
  {
    question: "Why do some articles mention fees or timelines without exact numbers?",
    answer:
      "Government fees, processing times, and eligibility criteria are revised periodically. Rather than risk showing outdated figures, our guides point you to the official portal's current fee or status page for the exact number at the time you apply.",
    sort_order: 7,
  },
];

export const ANNOUNCEMENTS: { id: string; title: string; body: string; level: string; active: boolean }[] = [
  {
    id: "ann-welcome",
    title: "Welcome to the new GovHub Guide section",
    body:
      "We've added in-depth guides and enriched service pages covering documents, fees, and step-by-step processes for popular services. More are being added regularly.",
    level: "info",
    active: true,
  },
];
