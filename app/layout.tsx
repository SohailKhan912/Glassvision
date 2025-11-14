import "./globals.css"

// Minimal layout stub — avoids importing providers or external scripts that may
// trigger the bundler to parse large dependency graphs during dev.

export const metadata = {
  title: "GlassVision",
  description: "Temporary minimal layout for debugging",
}

import Providers from "@/components/providers"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
