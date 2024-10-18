import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Bank Fee Avoidance Service</h1>
        <p className="text-xl text-muted-foreground">Protect your credit cards from inactivity fees</p>
      </header>

      <main>
        <section className="mb-16">
          <h2 className="text-3xl font-semibold mb-6">How It Works</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2" />
                  Small Monthly Fee
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>Pay a small monthly fee (0.5€ or 1€) to keep your credit cards active and avoid higher inactivity charges from your bank.</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="mr-2" />
                  Automatic Protection
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>We automatically process small transactions on your cards to keep them active, saving you from unexpected inactivity fees.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-semibold mb-6">Ready to Start Saving?</h2>
          <Button asChild size="lg">
            <Link href="/signup">Sign Up Now</Link>
          </Button>
        </section>
      </main>
    </div>
  );
}