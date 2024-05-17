import "@/styles/globals.scss";
import { Metadata} from "next";
import { siteConfig } from "@/config/site";
import { Providers } from "./providers";

export const metadata: Metadata = {
	title: {
		default: siteConfig.name,
		template: `%s - ${siteConfig.name}`,
	},
	description: siteConfig.description,
	icons: {
		icon: "/favicon.ico",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head />
			<body>
				<Providers themeProps={{ attribute: "class", defaultTheme: "dark" }}>
					<div className="relative flex flex-col h-screen">
						{/*<Navbar />*/}
						<main>
							{children}
						</main>
					</div>
				</Providers>
			</body>
		</html>
	);
}
