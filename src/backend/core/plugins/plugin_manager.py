from abc import ABC, abstractmethod
from typing import Any, Dict, List, Type
import importlib
import pkgutil
from pathlib import Path

class Plugin(ABC):
    """Base class for all plugins"""
    
    @abstractmethod
    def initialize(self, config: Dict[str, Any]) -> None:
        """Initialize the plugin with configuration"""
        pass
    
    @abstractmethod
    def get_name(self) -> str:
        """Get the plugin name"""
        pass
    
    @abstractmethod
    def get_version(self) -> str:
        """Get the plugin version"""
        pass

class PluginManager:
    """Manages plugin discovery, loading, and lifecycle"""
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialized = False
        return cls._instance
    
    def __init__(self):
        if not self._initialized:
            self._plugins: Dict[str, Plugin] = {}
            self._plugin_configs: Dict[str, Dict[str, Any]] = {}
            self._initialized = True
    
    def discover_plugins(self, plugin_dir: str) -> None:
        """Discover and load plugins from a directory"""
        plugin_path = Path(plugin_dir)
        
        for module_info in pkgutil.iter_modules([str(plugin_path)]):
            module = importlib.import_module(f"{plugin_dir}.{module_info.name}")
            
            # Look for Plugin subclasses in the module
            for attr_name in dir(module):
                attr = getattr(module, attr_name)
                if (isinstance(attr, type) and 
                    issubclass(attr, Plugin) and 
                    attr is not Plugin):
                    plugin_instance = attr()
                    self._plugins[plugin_instance.get_name()] = plugin_instance
    
    def initialize_plugin(self, plugin_name: str, config: Dict[str, Any]) -> None:
        """Initialize a specific plugin with configuration"""
        if plugin_name in self._plugins:
            self._plugins[plugin_name].initialize(config)
            self._plugin_configs[plugin_name] = config
    
    def get_plugin(self, plugin_name: str) -> Plugin:
        """Get a plugin instance by name"""
        return self._plugins.get(plugin_name)
    
    def get_all_plugins(self) -> List[Plugin]:
        """Get all loaded plugins"""
        return list(self._plugins.values())
    
    def get_plugins_by_type(self, plugin_type: Type[Plugin]) -> List[Plugin]:
        """Get all plugins of a specific type"""
        return [
            plugin for plugin in self._plugins.values()
            if isinstance(plugin, plugin_type)
        ]