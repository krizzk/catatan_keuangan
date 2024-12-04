import express from 'express'
import cors from 'cors'
import transaksiR from './routers/TransaksiR' //buat baru
// import { log } from 'console'
// import md5 from 'md5'


const PORT: number = 8000
const app = express()
app.use(cors())

app.use(`/Transaksi`,transaksiR)

app.listen(PORT, () => {
    console.log(`[Server]: Server is running at http://localhost:${PORT}`);
}) 