from typing import Dict, Any, Optional
from pydantic import BaseModel
import yaml
from pathlib import Path

class FeatureFlag(BaseModel):
    """Feature flag configuration"""
    name: str
    enabled: bool
    description: str
    parameters: Dict[str, Any] = {}

class FeatureManager:
    """Manages feature flags and their states"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._features: Dict[str, FeatureFlag] = {}
            self._config_path = Path("config/features.yaml")
            self._load_features()
            self._initialized = True
    
    def _load_features(self):
        """Load features from configuration file"""
        if not self._config_path.exists():
            return
        
        with open(self._config_path, 'r') as f:
            config = yaml.safe_load(f)
            for feature_name, feature_config in config.get('features', {}).items():
                self._features[feature_name] = FeatureFlag(
                    name=feature_name,
                    **feature_config
                )
    
    def is_enabled(self, feature_name: str) -> bool:
        """Check if a feature is enabled"""
        feature = self._features.get(feature_name)
        return feature.enabled if feature else False
    
    def get_parameter(self, feature_name: str, parameter_name: str) -> Optional[Any]:
        """Get a feature's parameter value"""
        feature = self._features.get(feature_name)
        if not feature or not feature.enabled:
            return None
        return feature.parameters.get(parameter_name)
    
    def register_feature(self, feature: FeatureFlag):
        """Register a new feature flag"""
        self._features[feature.name] = feature
        self._save_features()
    
    def _save_features(self):
        """Save features to configuration file"""
        config = {
            'features': {
                name: {
                    'enabled': feature.enabled,
                    'description': feature.description,
                    'parameters': feature.parameters
                }
                for name, feature in self._features.items()
            }
        }
        
        self._config_path.parent.mkdir(parents=True, exist_ok=True)
        with open(self._config_path, 'w') as f:
            yaml.safe_dump(config, f)