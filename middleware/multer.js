// import multer from 'multer'
// import fs from 'fs'

// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, 'uploads/')
//     },
//     filename: function (req, file, cb) {
//         cb(null, `${Date.now()}_${file.originalname}`)
//     }
// })
// const upload = multer({ storage: storage })
// export default upload


import express from 'express'
import multer from 'multer'
import path from 'path'


const app = express()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        // cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }
})
export default upload

// app.post('/upload-multiple', upload.array('files', 5), (req, res) => {
//     if (!req.files || req.files.length === 0) {
//         return res.status(400).json({ error: 'No files uploaded' })
//     }

//     const uploadedFiles = req.files.map(file => ({
//         filename: file.filename,
//         originalname: file.originalname,
//         size: file.size,
//         path: file.path
//     }))

//     res.json({
//         message: `${req.files.length} files uploaded successfully`,
//         files: uploadedFiles
//     })
// })