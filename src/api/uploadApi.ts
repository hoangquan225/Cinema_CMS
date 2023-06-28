// import ENDPONTAPI from "../common/endpoint"
import { ApiUploadFile } from "./config"

export const apiUploadFile = async (file: any) => {
    // return ApiUploadFile(ENDPONTAPI.UPLOAD, file)
    return ApiUploadFile("/upload", file)
}

export const apiUploadMultipleVideo =async (files:any, setProgress?: any, onProgress?: any) => {
    // return ApiUploadFile(ENDPONTAPI.UPLOAD_MULTIPLE_VIDEO, files, setProgress, onProgress)
}