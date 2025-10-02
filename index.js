const express = require('express')
const { Pool } = require("pg")

const app = express()

app.use(express.json()) // permite receber JSON no body
app.use(express.urlencoded({ extended: true }))

const pool = new Pool({
    connectionString: 'postgresql://neondb_owner:npg_t7ObTAGoI0PJ@ep-winter-violet-aczjkupi-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require',
    ssl: { rejectUnauthorized: false }
})

app.listen(8080, () => {
    console.log("o servidor foi aberto")
})

app.get("/avaliacoes", async (req, res)=>{
    const result = await pool.query("SELECT * FROM avaliacoes")
    res.json(result.rows)
})

app.post("/avaliacoes", async(req, res)=>{
    const { nome, comentario, estrelas } = req.body // exemplo de colunas

    const result = await pool.query(
      "INSERT INTO avaliacoes (nome, comentario, estrelas) VALUES ($1, $2, $3) RETURNING *",
      [nome, comentario, estrelas]
    );
    res.send("Obrigada pela sua avaliação!" + result.rows[0].id)
})