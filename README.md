# Campus DID 🎓🔗

![Demo Flow](https://uniledger-demo-2026.web.app/favicon.ico) *A Decentralized Identity (DID) Platform for Universities, powered natively by the Algorand TestNet.*

## 🌟 Short Description
**Campus DID** is a Web3-native identity protocol designed for higher education. It transforms physical student IDs into **tamper-proof, cryptographically secure Decentralized Identifiers (DIDs)** anchored directly to the Algorand blockchain. Students have complete self-sovereign control over their data, and university services (libraries, recruiters, hostels) can verify credentials flawlessly in sub-second time without relying on a centralized, hackable database.

---

## ⚠️ The Problem Statement
Modern universities rely on completely centralized databases to manage student credentials. This centralized paradigm introduces several critical flaws:
1. **Single Points of Failure:** Central databases are the ultimate honeypot for cyberattacks, data breaches, and ransomware.
2. **Credential Forgery:** Physical ID cards and PDF transcripts are easily faked or altered.
3. **Lack of Privacy & Data Ownership:** Students lose control over the trail of their Personally Identifiable Information (PII) once it leaves their hands.
4. **Inefficient Verification:** Verification by third-party recruiters or cross-campus entities is a slow, manual, and highly bureaucratic process.

---

## ✨ Features
*   **Self-Sovereign Identity (SSI):** Students locally generate their own Algorand keypairs. The university does not own the private key.
*   **Tamper-Proof Ledger Anchoring:** Pointers and cryptographic hashes of credentials are anchored via 0-ALGO transactions to the Algorand TestNet.
*   **Instant Verification Portal:** Any authorized party can verify student proofs instantly using the block transaction signatures.
*   **AlgoGuide AI Chatbot Assistant:** Features an Agentic AI chatbot integrated directly into the dashboard (powered by Google Gemini) to answer questions regarding Web3 security, DIDs, and campus integration.
*   **Offline Fallback Mode:** The platform is architected with highly resilient blockchain network hooks to gracefully simulate verifications if Algorand TestNet experiences outages during hackathon presentations.
*   **Selective Disclosure Ready:** Built to protect raw PII by strictly keeping heavy data encrypted off-chain.

---

## 🛠️ Tech Stack
*   **Blockchain Infrastructure:** Algorand TestNet (Algodv2)
*   **Smart Contracts / Ledger Integration:** Python (PyTeal roadmapped) & Algorand SDK
*   **Frontend Framework:** React (Vite) + TailwindCSS + Ant Design + Framer Motion
*   **AI Integration:** Agentic AI via Google Gemini API
*   **Backend Server:** Node.js (Express) for LLM proxy and API abstraction
*   **Deployment:** Google Firebase Hosting

---

## 🏗️ System Architecture Overview
The platform connects three primary entities:

1.  **The Student (Holder):** Uses a local browser wallet sequence to generate keys securely.
2.  **The University Admin (Issuer):** Generates digital verifiable credentials (VCs), digitally signs them, and anchors the proof onto the Algorand blockchain.
3.  **The Recruiter/Service (Verifier):** Accesses the Public Verification Portal. By querying the student's DID against the blockchain, they instantly receive a mathematical confirmation of the credential's validity without needing to trust a central server.

---

## 🚀 Demo Flow
1.  **Landing Page:** Introduction to the UniLedger architecture.
2.  **Student Registration:** A student authenticates and clicks `"Generate & Anchor Identity"`. This natively triggers an `algosdk` function to generate an ED25519 keypair and anchors the identity to Algorand.
3.  **Admin Dashboard:** The university admin logs in, views the active student roster, and officially `"Issues"` a verified credential to the underlying student DID.
4.  **Recruiter Verification:** A recruiter uses the `Public Verification Portal`, inputs the student's DID hash, and queries the blockchain. 
5.  **AlgoGuide Assistant:** Throughout the flow, the Agentic AI Assistant rests in the sub-screen ready to process contextual queries.

---

## ⚡ Why Algorand?
*   **Pure Proof of Stake (PPoS):** Ensures sub-second finality (blocks resolve in <3.3s) without the risk of forking. We cannot afford network rollbacks when managing access to university facilities.
*   **Carbon-Negative:** Aligns with modern university sustainability directives.
*   **Micro-Cent Gas Fees:** Anchoring DIDs across tens of thousands of students must be economically viable for a school treasury to subsidize. Algorand's static transaction fee makes cost scales 100% predictable.

---

## 🔮 Future Improvements
*   **Zero-Knowledge Proofs (ZKPs):** Implementing ZK-SNARKs so students can prove they are "Over 21" or "Enrolled" without actually revealing their exact age or GPA.
*   **Smart Card NFC Integration:** Bridging the Web3 wallet to physical IoT campus tap-in gates for doors & libraries.
*   **Cross-University Consortiums:** Creating a unified registry of Public Keys across international technical universities. 
