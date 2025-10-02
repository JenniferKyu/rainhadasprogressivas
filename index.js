const express = require('express')
const { Pool } = require("pg")
const cors = require("cors")

const app = express()

app.use(cors())
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

app.delete("/avaliacoes/:id", async (req, res)=>{
    const id = req.params.id
    await pool.query("DELETE FROM avaliacoes WHERE id = $1", [id])
    res.send("Avaliação deletada com sucesso!")
})

app.put("/avaliacoes/:id", async (req, res)=>{
    const id = req.params.id
    const { nome, comentario, estrelas } = req.body // exemplo de colunas

    await pool.query(                                  
        "UPDATE avaliacoes SET nome = $1, comentario = $2, estrelas = $3 WHERE id = $4",
        [nome, comentario, estrelas, id]
    );
    
    res.send("Avaliação atualizada com sucesso!")

})
