import React from "react";

export const metadata = {
  title: "Lagos Empire — Life & Hustle Simulator",
  description: "Start from scratch, build your education, company, and empire.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body className="bg-slate-950 text-white antialiased">{children}</body>
    </html>
  );
}
