import express from 'express'
import db_connection from './DB/connection.js'
import userRouter from './src/modules/user/user.routes.js'
import companyRouter from './src/modules/company/company.routes.js'
import jobRouter from './src/modules/job/job.routes.js'
import { globalResponse } from './src/middlewares/globalResponse.js'
import { config } from 'dotenv'


config({ path: './config/dev.config.env' })
const app = express()
const port = process.env.PORT
db_connection()



app.use(express.json())
app.use('/user',userRouter)
app.use('/company',companyRouter)
app.use('/job',jobRouter)

app.use(globalResponse)








app.listen(port, () => console.log(`Example app listening on port ${port}!`))