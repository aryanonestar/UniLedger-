import algopy
from algopy import ARC4Contract, Struct, String, UInt64, arc4, Global, Txn, urange
from algopy.arc4 import abimethod

class Credential(Struct):
    id: String
    issuer: String
    subject_did: String
    credential_type: String
    issued_at: UInt64
    is_revoked: algopy.UInt64 # 0 for valid, 1 for revoked

class IdentityProtocol(ARC4Contract):
    def __init__(self) -> None:
        self.identities = algopy.BoxMap(String, String) # DID -> Student Name/Hash
        self.credentials = algopy.BoxMap(String, Credential) # Credential ID -> Credential Data

    @abimethod
    def create_did(self, did: String, identity_hash: String) -> None:
        """
        Creates a decentralized identity anchored to Algorand.
        """
        assert not self.identities.contains(did), "DID already registered"
        self.identities[did] = identity_hash

    @abimethod
    def issue_credential(
        self, 
        credential_id: String, 
        issuer: String, 
        subject_did: String, 
        credential_type: String
    ) -> None:
        """
        University issues credential to student.
        """
        assert self.identities.contains(subject_did), "Subject DID not found"
        assert not self.credentials.contains(credential_id), "Credential ID already exists"
        
        new_credential = Credential(
            id=credential_id,
            issuer=issuer,
            subject_did=subject_did,
            credential_type=credential_type,
            issued_at=Global.latest_timestamp,
            is_revoked=UInt64(0)
        )
        self.credentials[credential_id] = new_credential

    @abimethod
    def verify_credential(self, credential_id: String) -> bool:
        """
        Allows campus services to verify student credentials.
        Returns true if the credential exists and is not revoked.
        """
        if not self.credentials.contains(credential_id):
            return False
            
        cred = self.credentials[credential_id]
        return cred.is_revoked == UInt64(0)

    @abimethod
    def revoke_credential(self, credential_id: String) -> None:
        """
        Admin revokes invalid credentials.
        """
        assert self.credentials.contains(credential_id), "Credential not found"
        
        # Only the issuer should ideally revoke, this is simplified for the hackathon
        cred = self.credentials[credential_id]
        cred.is_revoked = UInt64(1)
        self.credentials[credential_id] = cred

    @abimethod
    def get_identity(self, did: String) -> String:
        """
        Fetch DID data/hash.
        """
        assert self.identities.contains(did), "DID not found"
        return self.identities[did]
