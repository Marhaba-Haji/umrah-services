import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CompanySettings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [companyData, setCompanyData] = useState({
    companyName: "Marhaba Ventures",
    brandName: "Marhaba Haji Lovable App",
    logo: "",
    addresses: ["123 Main St, Makkah, Saudi Arabia"],
    emails: ["info@marhaba.com"],
    phones: ["+966 123 456 7890"],
    socialMedia: {
      facebook: "https://facebook.com/marhaba",
      instagram: "https://instagram.com/marhaba",
      twitter: "https://twitter.com/marhaba"
    },
    bankAccounts: [
      {
        bankName: "Al Rajhi Bank",
        accountName: "Marhaba Ventures Pvt Ltd",
        accountNumber: "SA1234567890123456789012",
        iban: "SA03 8000 0000 6080 1016 7519",
        swiftCode: "RJHI SA RI"
      }
    ]
  });

  const handleInputChange = (e, field, index = null, subField = null) => {
    const { name, value } = e.target;
    
    if (index !== null && subField) {
      // Handle nested objects in arrays (bank accounts)
      const updatedArray = [...companyData[field]];
      updatedArray[index] = { ...updatedArray[index], [subField]: value };
      setCompanyData({ ...companyData, [field]: updatedArray });
    }
    else if (index !== null) {
      // Handle array fields (addresses, emails, phones)
      const updatedArray = [...companyData[field]];
      updatedArray[index] = value;
      setCompanyData({ ...companyData, [field]: updatedArray });
    }
    else if (field === "socialMedia") {
      // Handle social media fields
      setCompanyData({
        ...companyData,
        socialMedia: { ...companyData.socialMedia, [name]: value }
      });
    }
    else {
      // Handle simple fields
      setCompanyData({ ...companyData, [name]: value });
    }
  };

  const handleAddItem = (field) => {
    setCompanyData({
      ...companyData,
      [field]: [...companyData[field], ""]
    });
  };

  const handleAddBankAccount = () => {
    setCompanyData({
      ...companyData,
      bankAccounts: [
        ...companyData.bankAccounts,
        {
          bankName: "",
          accountName: "",
          accountNumber: "",
          iban: "",
          swiftCode: "",
          ifscCode: ""
        }
      ]
    });
  };

  const handleRemoveItem = (field, index) => {
    const updatedArray = [...companyData[field]];
    updatedArray.splice(index, 1);
    setCompanyData({ ...companyData, [field]: updatedArray });
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setCompanyData({ ...companyData, logo: reader.result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would save to database
    alert("Company settings saved successfully!");
  };

  return (
    <Card className="shadow-none border-0">
      <CardHeader>
        <CardTitle>Company Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
            <TabsTrigger value="social">Social Media</TabsTrigger>
            <TabsTrigger value="bank">Bank Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  value={companyData.companyName}
                  onChange={(e) => handleInputChange(e, "companyName")}
                />
              </div>

              <div>
                <Label htmlFor="brandName">Brand Name</Label>
                <Input
                  id="brandName"
                  name="brandName"
                  value={companyData.brandName}
                  onChange={(e) => handleInputChange(e, "brandName")}
                />
              </div>

              <div>
                <Label htmlFor="logo">Company Logo</Label>
                {companyData.logo && (
                  <img 
                    src={companyData.logo} 
                    alt="Company Logo" 
                    className="w-32 h-32 object-contain mb-2 border rounded"
                  />
                )}
                <Input 
                  type="file" 
                  id="logo" 
                  accept="image/*"
                  onChange={handleLogoUpload}
                />
              </div>

              <div className="mt-4 flex justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddBankAccount}
                >
                  Add Bank Account
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="contact">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Addresses</Label>
                {companyData.addresses.map((address, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      value={address}
                      onChange={(e) => handleInputChange(e, "addresses", index)}
                    />
                    <Button 
                      type="button" 
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleRemoveItem("addresses", index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => handleAddItem("addresses")}
                >
                  Add Address
                </Button>
              </div>

              <div>
                <Label>Email Addresses</Label>
                {companyData.emails.map((email, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => handleInputChange(e, "emails", index)}
                    />
                    <Button 
                      type="button" 
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleRemoveItem("emails", index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => handleAddItem("emails")}
                >
                  Add Email
                </Button>
              </div>

              <div>
                <Label>Phone Numbers</Label>
                {companyData.phones.map((phone, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <Input
                      type="tel"
                      value={phone}
                      onChange={(e) => handleInputChange(e, "phones", index)}
                    />
                    <Button 
                      type="button" 
                      variant="destructive"
                      className="ml-2"
                      onClick={() => handleRemoveItem("phones", index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="secondary"
                  onClick={() => handleAddItem("phones")}
                >
                  Add Phone
                </Button>
              </div>

              <div className="mt-4 flex justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleAddBankAccount}
                >
                  Add Bank Account
                </Button>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="social">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="facebook">Facebook URL</Label>
                <Input
                  id="facebook"
                  name="facebook"
                  value={companyData.socialMedia.facebook}
                  onChange={(e) => handleInputChange(e, "socialMedia")}
                />
              </div>

              <div>
                <Label htmlFor="instagram">Instagram URL</Label>
                <Input
                  id="instagram"
                  name="instagram"
                  value={companyData.socialMedia.instagram}
                  onChange={(e) => handleInputChange(e, "socialMedia")}
                />
              </div>

              <div>
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  name="twitter"
                  value={companyData.socialMedia.twitter}
                  onChange={(e) => handleInputChange(e, "socialMedia")}
                />
              </div>

              <Button type="submit" className="mt-4">Save Changes</Button>
            </form>
          </TabsContent>

          <TabsContent value="bank">
            <form onSubmit={handleSubmit} className="space-y-4">
              {companyData.bankAccounts.map((account, index) => (
                <div key={index} className="border p-4 rounded-lg space-y-4">
                  <div>
                    <Label htmlFor={`bankName-${index}`}>Bank Name</Label>
                    <Input
                      id={`bankName-${index}`}
                      name="bankName"
                      value={account.bankName}
                      onChange={(e) => handleInputChange(e, "bankAccounts", index, "bankName")}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`accountName-${index}`}>Account Name</Label>
                    <Input
                      id={`accountName-${index}`}
                      name="accountName"
                      value={account.accountName}
                      onChange={(e) => handleInputChange(e, "bankAccounts", index, "accountName")}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`accountNumber-${index}`}>Account Number</Label>
                    <Input
                      id={`accountNumber-${index}`}
                      name="accountNumber"
                      value={account.accountNumber}
                      onChange={(e) => handleInputChange(e, "bankAccounts", index, "accountNumber")}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`iban-${index}`}>IBAN</Label>
                    <Input
                      id={`iban-${index}`}
                      name="iban"
                      value={account.iban}
                      onChange={(e) => handleInputChange(e, "bankAccounts", index, "iban")}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`swiftCode-${index}`}>SWIFT Code</Label>
                    <Input
                      id={`swiftCode-${index}`}
                      name="swiftCode"
                      value={account.swiftCode}
                      onChange={(e) => handleInputChange(e, "bankAccounts", index, "swiftCode")}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`ifscCode-${index}`}>IFSC Code</Label>
                    <Input
                      id={`ifscCode-${index}`}
                      name="ifscCode"
                      value={account.ifscCode}
                      onChange={(e) => handleInputChange(e, "bankAccounts", index, "ifscCode")}
                    />
                  </div>
                </div>
              ))}

              <Button type="submit" className="mt-4">Save Changes</Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CompanySettings;