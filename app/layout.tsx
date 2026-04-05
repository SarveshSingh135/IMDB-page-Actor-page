// @ts-ignore
import "./globals.css"
import { ThemeProvider } from "@/context/ThemeContext"
import QueryProvider from "@/context/QueryProvider"

export default function RootLayout({ children }: any) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <QueryProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  )
}