import "./globals.css"; // Pastikan path ini benar!
import AuthProvider from "@/components/AuthProvider"
import RootProvider from "@/components/RootProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider>
          <AuthProvider>{children}</AuthProvider>
        </RootProvider>
      </body>
    </html>
  );
}