"use client"

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, DollarSign, Calendar } from 'lucide-react';

// Mock data for demonstration purposes
const mockUserData = {
  name: 'John Doe',
  email: 'john@example.com',
  subscriptionFee: 0.5,
  nextPaymentDate: '2023-06-15',
  totalSaved: 25.5,
  cards: [
    { id: 1, last4: '1234', bank: 'Bank A' },
    { id: 2, last4: '5678', bank: 'Bank B' },
  ],
};

export default function Dashboard() {
  const [userData, setUserData] = useState(mockUserData);

  // In a real application, you would fetch user data from your backend here
  useEffect(() => {
    // Simulating an API call
    setTimeout(() => {
      setUserData(mockUserData);
    }, 1000);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Subscription Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p><strong>Name:</strong> {userData.name}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Monthly Fee:</strong> €{userData.subscriptionFee.toFixed(2)}</p>
            <p><strong>Next Payment:</strong> {userData.nextPaymentDate}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              <p className="text-2xl font-bold">€{userData.totalSaved.toFixed(2)}</p>
            </div>
            <p className="text-sm text-muted-foreground">Total saved in potential bank fees</p>
          </CardContent>
        </Card>
      </div>

      <h2 className="text-2xl font-semibold mt-12 mb-4">Protected Cards</h2>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {userData.cards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="mr-2" />
                {card.bank}
              </CardTitle>
              <CardDescription>**** **** **** {card.last4}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" size="sm">Update Card</Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-12">
        <Button>Add New Card</Button>
      </div>
    </div>
  );
}