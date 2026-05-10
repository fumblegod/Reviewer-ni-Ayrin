export const metadata = {
  title: "NURSEiq — AI Nursing Study Platform",
  description: "AI-powered nursing review platform with quizzes, notes, and progress tracking",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
