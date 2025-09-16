import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const SettingsPlaceholder = () => (
	<div className="space-y-6">
		<Card>
			<CardHeader>
				<CardTitle>Admin Settings</CardTitle>
				<CardDescription>Coming soon...</CardDescription>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground">
					Settings panel will be implemented here.
				</p>
			</CardContent>
		</Card>
	</div>
);

export default SettingsPlaceholder;
