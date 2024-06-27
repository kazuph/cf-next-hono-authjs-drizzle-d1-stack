import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const features = [
  {
    title: "Task Management",
    description: "Organize and prioritize your tasks effortlessly.",
  },
  {
    title: "Collaboration Tools",
    description: "Work seamlessly with your team in real-time.",
  },
  {
    title: "Analytics Dashboard",
    description: "Gain insights into your productivity and performance.",
  },
  {
    title: "Integration Support",
    description: "Connect with your favorite tools and services.",
  },
];

export default function Features() {
  return (
    <section id="features" className="px-6 py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="mb-12 text-3xl font-bold text-center">Features</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
