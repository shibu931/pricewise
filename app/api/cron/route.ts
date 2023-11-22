import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose/mongoose";
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scaper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils/utils";
import { NextResponse } from "next/server";

export const maxDuration = 10
export const dynamic = 'force-dynamic'
export const revalidate=0

export async function GET(){
    try {
        connectToDB();
        const products = await Product.find({});
        if(!products) throw new Error("No Product Found") ;
        const updatedProduct = await Promise.all(
            products.map(async (currentProduct)=>{
                const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);

                if(!scrapedProduct) throw new Error("No Product Found");

                const updatedPriceHistory:any = [
                    ...currentProduct.priceHistory,
                    {price:scrapedProduct.currentPrice}
                ];
                const product ={
                    ...scrapedProduct,
                    priceHistory: updatedPriceHistory,
                    lowestPrice: getLowestPrice(updatedPriceHistory),
                    highestPrice: getHighestPrice(updatedPriceHistory),
                    averagePrice:getAveragePrice(updatedPriceHistory)
                }
            const updatedProduct = await Product.findOneAndUpdate(
                {url:product.url},
                product,
            );

            //  2. Check Each Product Status     
            const emailNotificationType = getEmailNotifType(scrapedProduct,currentProduct)

            if(emailNotificationType && updatedProduct.users.length > 0){
                const productInfo = {
                    title: updatedProduct.title,
                    url: updatedProduct.url,
                }
                const emailContent = await generateEmailBody(productInfo,emailNotificationType);
                const userEmails = updatedProduct.users.map((user:any)=> user.email)
                await sendEmail(emailContent ,userEmails)
            }
            return updatedProduct
            })
        )
        return NextResponse.json({
            message:'Ok',data:updatedProduct
        })
    } catch (error) {
        console.log(error)
        return NextResponse.json({
            message:'failed'
        })
    }
}