using Dapper;
using LLama;
using Npgsql;

namespace api; 

public class SearchResult {
    public string EmbedString { get; set; } = "";
    public float Distance { get; set; }
}

public class DBService(IConfiguration config, LLamaEmbedder service) {
    public async Task AddItem(string item) {
        using var conn = new NpgsqlConnection(config["DOTNET_CONNECTION_STRING"]);

        var embedding = (await service.GetEmbeddings(item))[0] ?? throw new Exception("Embedding was null");
        string sql = """"
            insert into search (embedString, embedding) 
            values (@item, @embedding)
            """";
        await conn.ExecuteAsync(sql, new { item, embedding });
    }

    public async Task<IEnumerable<string>> GetItems() {
        using var conn = new NpgsqlConnection(config["DOTNET_CONNECTION_STRING"]);
        string sql = """"
            SELECT embedString
            FROM search
            """";
        return await conn.QueryAsync<string>(sql);
    }

    public async Task<IEnumerable<SearchResult>> GetNearbyItems(float[] embedding, int limit) {
        using var conn = new NpgsqlConnection(config["DOTNET_CONNECTION_STRING"]);
        string sql = """"
            SELECT embedString, embedding <-> @embedding::vector AS distance
            FROM search
            ORDER BY embedding <-> @embedding::vector
            LIMIT @limit
            """";
        return await conn.QueryAsync<SearchResult>(sql, new { embedding, limit });
    }
}