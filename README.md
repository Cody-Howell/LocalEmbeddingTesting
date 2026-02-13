# Local Embedding Testing

This project shows an example use of the LlamaSharp library to run a model in-memory for embedding purposes. The example can take in strings and embed them before putting them into the Postgres database, then can run distance searches using PGVector, and it seems to be quite responsive (at least on non-virtualized hardware; I have not yet tested it in the cloud). 

## Setup

1. Install the Q6_K model from this link: https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe-GGUF and put it in a new `/api/GGUF` folder. 
2. Run the docker compose. 
3. Add a few strings. I usually try some numbers, then some descriptions of things around me (such as mountains or grass). 
4. Search. Try some things that are the same category to what you wrote. 

This is in no way optimized for anything; just a proof of concept that you _can_ do local embeddings. 

The model also isn't that great (you can see all the stats, like context window on Huggingface), but it works pretty fast. And is moderately okay at understanding semantics. You'd have to test out a few different models. 

Also, it was _heck_ trying to get things integrated. Setting up the API, DB, and frontend went okay when I was running them all from the console, but trying to get the API with the model into a Dockerfile turned out to be much harder than expected, to which I have no idea why. 

Oh, and if you do change models to test something else, you should just be able to change the file path in `Program.cs`and it should get whatever you put in. The only restriction is that it has to be a `.gguf` file with my current config of LlamaSharp (at least from my understanding; I just got something to work and stopped). 