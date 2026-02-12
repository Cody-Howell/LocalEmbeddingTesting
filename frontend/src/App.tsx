import { useState, useEffect } from "react";
import "./App.css";

interface Item {
  embedString: string;
  distance: number;
}

function App() {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // Load items on startup
  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const response = await fetch("/api/items");
      if (response.ok) {
        const data = await response.json();
        setItems(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error loading items:", error);
    }
  };

  const handleAdd = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/add?query=${encodeURIComponent(inputText)}`);
      if (response.ok) {
        // Refresh the items list after successful add
        await loadItems();
        setInputText(""); // Clear the input
        setSearchResults([]); // Clear search results
      }
    } catch (error) {
      console.error("Error adding item:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!inputText.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(inputText)}`);
      if (response.ok) {
        const data = await response.json();
        setSearchResults(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error searching items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h1>Local Embedding Testing</h1>
      <div className="card">
        <div style={{ marginBottom: "20px" }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter text to add or search..."
            rows={3}
            cols={50}
            style={{ display: "block", marginBottom: "10px", padding: "8px" }}
          />
          <div>
            <button
              onClick={handleAdd}
              disabled={loading || !inputText.trim()}
              style={{ marginRight: "10px", padding: "8px 16px" }}
            >
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              onClick={handleSearch}
              disabled={loading || !inputText.trim()}
              style={{ padding: "8px 16px" }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ flex: 1 }}>
            <h3>All Items ({items.length})</h3>
            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
              {items.length === 0 ? (
                <p>No items available</p>
              ) : (
                <ul>
                  {items.map((item, index) => (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <h3>Search Results ({searchResults.length})</h3>
            <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
              {searchResults.length === 0 ? (
                <p>No search results</p>
              ) : (
                <ul>
                  {searchResults.map((item, index) => (
                    <li key={index} style={{ marginBottom: "5px" }}>
                      {item.embedString} : {item.distance}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
