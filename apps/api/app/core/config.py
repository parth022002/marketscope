from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "MarketScope.io API"
    app_env: str = "development"
    api_cors_origins: str = "http://localhost:3000"
    database_url: str = "postgresql+psycopg://marketscope:local_dev_change_me@localhost:5432/marketscope"
    redis_url: str = "redis://localhost:6379/0"

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        return [origin.strip() for origin in self.api_cors_origins.split(",") if origin.strip()]


settings = Settings()
