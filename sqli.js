
var resultsElem = document.getElementById("results");
var db;

config = {
    locateFile: (filename, prefix) => {
        console.log(`prefix is : ${prefix}`);
        return `./${filename}`;
    }
}

function init_db(){
    
    if (window.db == null){
        // The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
        // We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
        initSqlJs(config).then(function (SQL) {
            //Create the database
            window.db = new SQL.Database();

            window.db.run("CREATE TABLE users (id, username, password, email);");
            window.db.run("INSERT INTO users VALUES (?,?,?,?)", [1, "admin", "secretpassword", "admin@fakeemail.com"]);
            window.db.run("INSERT INTO users VALUES (?,?,?,?)", [2, "alice", "alicespassword", "alice@fakeemail.com"]);
            window.db.run("INSERT INTO users VALUES (?,?,?,?)", [3, "bob", "bobspassword", "bob@fakeemail.com"]);
            window.db.run("INSERT INTO users VALUES (?,?,?,?)", [4, "eve", "evespassword", "eve@fakeemail.com"]);

            window.db.run("CREATE TABLE products (id, name, description);");
            window.db.run("INSERT INTO products VALUES (?,?,?)", [1, "book", "This is the best book ever written."]);
            window.db.run("INSERT INTO products VALUES (?,?,?)", [2, "table", "This table has four legs and holds stuff off the ground."]);
            window.db.run("INSERT INTO products VALUES (?,?,?)", [3, "chair", "Another item with four legs that keeps people comfortably off the ground."]);
            window.db.run("INSERT INTO products VALUES (?,?,?)", [4, "vase", "This cylindrical object holds things like flowers all together."]);
        });

    }
}

function runQuery(query_string){
    init_db();
    var resultsElem = document.getElementById('results');

    document.getElementById("query").innerHTML = "<pre class='language-sql'><code>" + query_string + "</code></pre>";
    Prism.highlightAll();
    var stmt;
    
    try{
        console.log("Preparing query:");
        console.log(query_string);
        console.log(window.db);
        stmt = window.db.prepare(query_string);
        console.log("Query prepared.");
        var rows = 0;
        var resultString = "<div>";
        console.log("Showing results.");
        while (stmt.step()) { //
            var row = stmt.getAsObject();
            console.log('Here is a row: ' + JSON.stringify(row));
            resultString += JSON.stringify(row) + "<br>";
            rows++;
        }
        resultString += "</div><br>";
        resultsElem.innerHTML = resultString;
        if (rows == 0){
            console.log("No rows returned.")
            resultsElem.textContent = "NO ROWS RETURNED";
        }
    }
    catch(err){
        error("Error in SQL query");
        resultsElem.textContent = "ERROR";
    }
}

function runProductQuery(){
    var query_string = "SELECT id, name, description FROM products WHERE id=" + document.getElementById('product').value;
    runQuery(query_string);
}

function runLoginQuery(){
    var query_string = "SELECT username, password, email FROM users WHERE username='" + document.getElementById('username').value + 
    "' AND password='" + document.getElementById('password').value + "';";
    runQuery(query_string);
}

function error(e) {
	console.log(e);
	resultsElem.textContent = e;
}

if (document.getElementById("username")){
    document.getElementById("username").addEventListener("keyup", runLoginQuery);
    document.getElementById("password").addEventListener("keyup", runLoginQuery);
}
if (document.getElementById("product")){
    document.getElementById("product").addEventListener("keyup", runProductQuery);
}