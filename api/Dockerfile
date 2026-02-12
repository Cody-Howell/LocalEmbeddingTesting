FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 5044

# Install native dependencies required by LLamaSharp
RUN apt-get update && apt-get install -y \
    libc6-dev \
    libgcc-s1 \
    libstdc++6 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["api.csproj", "."]
RUN dotnet restore "./api.csproj"
COPY . .
WORKDIR "/src/."
RUN dotnet build "api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
# Copy GGUF directory from build context
COPY --from=build /src/GGUF ./GGUF

# Ensure the native libraries are executable and in the right location
RUN find . -name "*.so*" -exec chmod +x {} \; || true
RUN find . -name "runtimes" -type d || echo "No runtimes directory found"

# Set library path environment variable
ENV LD_LIBRARY_PATH=/app:/app/runtimes/linux-x64/native:$LD_LIBRARY_PATH

ENTRYPOINT ["dotnet", "api.dll"]