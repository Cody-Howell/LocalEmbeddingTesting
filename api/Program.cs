using api;
using LLama;
using LLama.Common;

var builder = WebApplication.CreateBuilder(args);
string file = "./GGUF/nomic-embed-text-v2-moe.Q6_K.gguf";
try {
    Console.WriteLine($"Looking for model file at: {Path.GetFullPath(file)}");
    Console.WriteLine($"File exists: {File.Exists(file)}");
    
    var parameters = new ModelParams(file);
    var weights = LLamaWeights.LoadFromFile(parameters);
    var embedder = new LLamaEmbedder(weights, parameters);
    builder.Services.AddSingleton(embedder);
} catch (Exception ex) {
    Console.WriteLine($"Error loading model: {ex.Message}");
    Console.WriteLine($"Stack trace: {ex.StackTrace}");
    throw new Exception($"Failed to load weight model: {ex.Message}", ex);
}

builder.Services.AddSingleton<DBService>();

var app = builder.Build();

app.MapGet("/api", () => "Hello World!");
app.MapGet("/api/items", (DBService service) => service.GetItems());
app.MapGet("/api/embed", (string query, LLamaEmbedder service) => service.GetEmbeddings(query));
app.MapGet("/api/add", (string query, DBService service) => service.AddItem(query));
app.MapGet("/api/search", async (string query, DBService service, LLamaEmbedder embedder) => {
    var embedding = await embedder.GetEmbeddings(query);
    return await service.GetNearbyItems(embedding[0], 10);
});

app.Run();
