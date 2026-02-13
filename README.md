# Local Embedding Testing

This project shows an example use of the LlamaSharp library to run a model in-memory for embedding purposes. The example can take in strings and embed them before putting them into the Postgres database, then can run distance searches using PGVector, and it seems to be quite responsive (at least on non-virtualized hardware; I have not yet tested it in the cloud). 

## Setup

1. Install the Q6_K model from this link: https://huggingface.co/nomic-ai/nomic-embed-text-v2-moe-GGUF and put it in a new `/api/GGUF` folder. 
2. Run the docker compose. 
3. Add a few strings. I usually try some numbers, then some descriptions of things around me (such as mountains or grass). 
4. Search. Try some things that are the same category to what you wrote. 

This is in no way optimized for anything; just a proof of concept that you _can_ do local embeddings. 