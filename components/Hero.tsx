import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="px-6 py-20 text-white bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="mb-6 text-4xl font-bold md:text-6xl">Revolutionize Your Workflow</h1>
        <p className="mb-8 text-xl">Streamline your tasks, boost productivity, and achieve more with our cutting-edge SaaS platform.</p>
        <Button size="lg" className="text-blue-600 bg-white hover:bg-blue-50">Get Started for Free</Button>
      </div>
    </section>
  );
}
