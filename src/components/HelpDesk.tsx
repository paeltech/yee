import { useState } from "react";
import { HelpCircle, X, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContactInfo } from "@/components/landing/ContactInfo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const faqItems = [
  {
    category: "Login & Registration",
    questions: [
      {
        q: "How do I log in to the portal?",
        a: "Use your registered email and password to log in. If you've forgotten your password, click 'Forgot Password?' on the login page to reset it."
      },
      {
        q: "I can't remember my password",
        a: "Click the 'Forgot Password?' link on the login page and follow the instructions to reset your password."
      },
      {
        q: "How do I register for the program?",
        a: "Contact your group administrator or program coordinator to get registered. They will provide you with login credentials."
      }
    ]
  },
  {
    category: "Navigation",
    questions: [
      {
        q: "How do I navigate the portal?",
        a: "Use the sidebar menu on the left to access different sections: Dashboard, Groups, Members, Activities, and more. Click on any menu item to navigate to that section."
      },
      {
        q: "What can I see on the dashboard?",
        a: "The dashboard shows an overview of key statistics, trends, and recent activities relevant to your role and permissions."
      },
      {
        q: "How do I find specific information?",
        a: "Use the search functionality in each section, or browse through the organized menu items to find what you need."
      }
    ]
  },
  {
    category: "Common Tasks",
    questions: [
      {
        q: "How do I add a new member?",
        a: "Navigate to the Members section and click the 'Add Member' button. Fill in the required information and submit the form."
      },
      {
        q: "How do I upload a document?",
        a: "Go to the Resource Center or Group Documents section, click 'Upload Document', select your file, add a description, and submit."
      },
      {
        q: "How do I create an activity?",
        a: "Navigate to the Activities section and click 'Add Activity'. Fill in the activity details including date, type, location, and description."
      },
      {
        q: "How do I view group information?",
        a: "Go to the Groups section to see a list of all groups. Click on a group name to view detailed information and group documents."
      }
    ]
  }
];

export function HelpDesk() {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFAQs = faqItems.map(category => ({
    ...category,
    questions: category.questions.filter(item =>
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-500 text-black hover:bg-brand-600 text-black shadow-lg z-50"
        size="icon"
        aria-label="Open help desk"
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Help & Support</DialogTitle>
            <DialogDescription>
              Find answers to common questions or get in touch with our support team
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="contact">Contact Us</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400" />
                <Input
                  placeholder="Search for help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {filteredFAQs.length === 0 ? (
                <div className="text-center py-8 text-neutral-500">
                  <p>No results found. Try a different search term.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {filteredFAQs.map((category) => (
                    <Card key={category.category} className="border-neutral-200">
                      <CardHeader>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {category.questions.map((item, index) => (
                            <div key={index} className="border-l-4 border-brand-500 pl-4">
                              <h4 className="font-semibold text-neutral-900 mb-2">{item.q}</h4>
                              <p className="text-sm text-neutral-600">{item.a}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="contact" className="space-y-4">
              <Card className="border-neutral-200">
                <CardHeader>
                  <CardTitle>Administrative Contact Information</CardTitle>
                  <CardDescription>
                    Reach out to us for assistance with login, registration, or system navigation
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactInfo variant="compact" />
                </CardContent>
              </Card>

              <Card className="border-neutral-200">
                <CardHeader>
                  <CardTitle>Need More Help?</CardTitle>
                  <CardDescription>
                    If you can't find what you're looking for, please contact our support team using the information above.
                  </CardDescription>
                </CardHeader>
              </Card>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
}

