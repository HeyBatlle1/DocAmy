import httpx
import hmac
import hashlib
import json
from typing import Dict, Any, Optional, List
from config import settings
import logging

logger = logging.getLogger(__name__)

class TavusService:
    def __init__(self):
        self.api_key = settings.TAVUS_API_KEY
        self.base_url = settings.TAVUS_API_BASE
        self.webhook_secret = settings.TAVUS_WEBHOOK_SECRET
        
        self.headers = {
            "Content-Type": "application/json",
            "x-api-key": self.api_key
        }
    
    async def test_connection(self) -> bool:
        """Test connection to Tavus API"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/replicas",
                    headers=self.headers,
                    timeout=10.0
                )
                return response.status_code == 200
        except Exception as e:
            logger.error(f"Tavus API connection test failed: {e}")
            return False
    
    async def create_conversation(
        self,
        replica_id: str,
        persona_id: str,
        properties: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Create a new conversation with Tavus"""
        try:
            payload = {
                "replica_id": replica_id,
                "persona_id": persona_id,
                "properties": properties or {}
            }
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/conversations",
                    headers=self.headers,
                    json=payload,
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    error_data = response.json() if response.content else {}
                    raise Exception(f"Tavus API error: {error_data.get('message', response.text)}")
                
                return response.json()
                
        except httpx.TimeoutException:
            raise Exception("Tavus API request timed out")
        except Exception as e:
            logger.error(f"Error creating conversation: {e}")
            raise
    
    async def send_message(
        self,
        conversation_id: str,
        text: str
    ) -> Dict[str, Any]:
        """Send a message to a conversation"""
        try:
            payload = {"text": text}
            
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    f"{self.base_url}/conversations/{conversation_id}",
                    headers=self.headers,
                    json=payload,
                    timeout=60.0
                )
                
                if response.status_code != 200:
                    error_data = response.json() if response.content else {}
                    raise Exception(f"Tavus API error: {error_data.get('message', response.text)}")
                
                return response.json()
                
        except httpx.TimeoutException:
            raise Exception("Tavus API request timed out")
        except Exception as e:
            logger.error(f"Error sending message: {e}")
            raise
    
    async def get_conversation_status(self, conversation_id: str) -> Dict[str, Any]:
        """Get conversation status from Tavus"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/conversations/{conversation_id}",
                    headers=self.headers,
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    error_data = response.json() if response.content else {}
                    raise Exception(f"Tavus API error: {error_data.get('message', response.text)}")
                
                return response.json()
                
        except httpx.TimeoutException:
            raise Exception("Tavus API request timed out")
        except Exception as e:
            logger.error(f"Error getting conversation status: {e}")
            raise
    
    async def delete_conversation(self, conversation_id: str) -> bool:
        """Delete a conversation from Tavus"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.delete(
                    f"{self.base_url}/conversations/{conversation_id}",
                    headers=self.headers,
                    timeout=30.0
                )
                
                return response.status_code == 204
                
        except Exception as e:
            logger.error(f"Error deleting conversation: {e}")
            return False
    
    async def list_replicas(self) -> List[Dict[str, Any]]:
        """List available replicas"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/replicas",
                    headers=self.headers,
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    error_data = response.json() if response.content else {}
                    raise Exception(f"Tavus API error: {error_data.get('message', response.text)}")
                
                return response.json().get("data", [])
                
        except Exception as e:
            logger.error(f"Error listing replicas: {e}")
            raise
    
    async def list_personas(self) -> List[Dict[str, Any]]:
        """List available personas"""
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{self.base_url}/personas",
                    headers=self.headers,
                    timeout=30.0
                )
                
                if response.status_code != 200:
                    error_data = response.json() if response.content else {}
                    raise Exception(f"Tavus API error: {error_data.get('message', response.text)}")
                
                return response.json().get("data", [])
                
        except Exception as e:
            logger.error(f"Error listing personas: {e}")
            raise
    
    def verify_webhook_signature(self, payload: bytes, signature: str) -> bool:
        """Verify Tavus webhook signature"""
        try:
            if not signature or not self.webhook_secret:
                return False
            
            expected_signature = hmac.new(
                self.webhook_secret.encode(),
                payload,
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(f"sha256={expected_signature}", signature)
            
        except Exception as e:
            logger.error(f"Error verifying webhook signature: {e}")
            return False