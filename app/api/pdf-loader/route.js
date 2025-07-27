import { NextResponse } from "next/server";
import { WebPDFLoader } from "@langchain/community/document_loaders/web/pdf";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// const pdfUrl = "https://different-stingray-959.convex.cloud/api/storage/6064fb3c-8822-40e6-8fac-821c557ae198"
export async function GET(req) {
    const reqUrl=req.url;
    const{ searchParams }= new URL(reqUrl);
    const pdfUrl=searchParams.get('pdfUrl');

    // 1.Load PDF file
    const response = await fetch(pdfUrl);
    const data = await response.blob();
    const loader = new WebPDFLoader(data);
    const docs = await loader.load();

    let pdfTextContent = '';
    docs.forEach(doc => {
        pdfTextContent = pdfTextContent + doc.pageContent;
    })

    //2. Text split
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 800,
        chunkOverlap: 100,
    });
    const output = await splitter.createDocuments([pdfTextContent]);
    
    let splitterList=[];
    output.forEach(doc=>{
        splitterList.push(doc.pageContent);
    })

    return NextResponse.json({ result: splitterList })
}
