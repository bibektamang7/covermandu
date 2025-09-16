import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

const AnalyticsPlaceholder = () => {
	return (
		<div className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Analytics Dashboard</CardTitle>
					<CardDescription>Coming soon...</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						Analytics features will be implemented here.
					</p>
				</CardContent>
			</Card>
		</div>
	);
};

export default AnalyticsPlaceholder;
