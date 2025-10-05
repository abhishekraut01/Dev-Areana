import express from 'express'

const app = express()



app.listen(process.env.PORT ?? 5000, () => {
    console.log(`server is running on port : ${process.env.PORT ?? 5000}`)
})