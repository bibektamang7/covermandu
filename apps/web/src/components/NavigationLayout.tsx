"use client";

import React from "react";
import { SessionProvider, useSession } from "next-auth/react";
import { Navigation } from "./Navigation";

function AuthWatcher({ children }: { children: React.ReactNode }) {
	const { data: session, status } = useSession();

	if (status === "loading") {
		return <div>LOADING...</div>;
	}
	return children;
}

const NavigationLayout = () => {
	return (
		<SessionProvider
			refetchInterval={60}
			refetchOnWindowFocus={true}
		>
			<AuthWatcher>
				<Navigation />
			</AuthWatcher>
		</SessionProvider>
	);
};

export default NavigationLayout;
