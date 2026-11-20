from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MarketScope.io API"
    app_env: str = "development"
    app_debug: bool = True
    secret_key: str = "local_development_secret_key_minimum_32_chars_long_123456"
    snapshot_signing_salt: str = "marketscope_snapshot_signing_salt_development"
    api_cors_origins: str = "http://localhost:3000,http://127.0.0.1:3000"

    database_url: str = "postgresql+psycopg://marketscope:local_dev_change_me@localhost:5432/marketscope"
    database_pool_url: str = ""
    redis_url: str = "redis://localhost:6379/0"

    mock_auth_enabled: bool = False
    clerk_secret_key: str = ""
    clerk_publishable_key: str = ""

    market_data_provider: str = "hybrid"
    fmp_api_key: str = ""
    twelvedata_api_key: str = ""
    financial_data_api_key: str = ""

    ai_enabled: bool = True
    openrouter_api_key: str = ""
    groq_api_key: str = ""
    gemini_api_key: str = ""

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.api_cors_origins.split(",") if origin.strip()]


settings = Settings()
