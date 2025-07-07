
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Settings, Shield, AlertTriangle, CheckCircle } from "lucide-react";

interface PaymentGatewaySettings {
  id: string;
  gateway_name: string;
  environment: 'test' | 'live';
  is_active: boolean;
  merchant_key: string;
  salt_32bit: string;
  salt_256bit?: string;
  gateway_url: string;
  created_at: string;
  updated_at: string;
}

const PayUGatewayManager = () => {
  const [testSettings, setTestSettings] = useState<PaymentGatewaySettings | null>(null);
  const [liveSettings, setLiveSettings] = useState<PaymentGatewaySettings | null>(null);
  const [activeEnvironment, setActiveEnvironment] = useState<'test' | 'live'>('test');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Fetch payment gateway settings
      const { data: gatewaySettings, error: gatewayError } = await supabase
        .from('payment_gateway_settings')
        .select('*')
        .eq('gateway_name', 'payu');

      if (gatewayError) throw gatewayError;

      // Separate test and live settings
      const testSetting = gatewaySettings?.find(s => s.environment === 'test');
      const liveSetting = gatewaySettings?.find(s => s.environment === 'live');

      setTestSettings(testSetting || null);
      setLiveSettings(liveSetting || null);

      // Fetch active environment
      const { data: systemSetting, error: systemError } = await supabase
        .from('system_settings')
        .select('setting_value')
        .eq('setting_key', 'payu_active_environment')
        .single();

      if (systemError) throw systemError;

      if (systemSetting?.setting_value) {
        const env = JSON.parse(systemSetting.setting_value as string);
        setActiveEnvironment(env);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast({
        title: "Error",
        description: "Failed to load payment gateway settings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (environment: 'test' | 'live', data: Partial<PaymentGatewaySettings>) => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('payment_gateway_settings')
        .update(data)
        .eq('gateway_name', 'payu')
        .eq('environment', environment);

      if (error) throw error;

      toast({
        title: "Success",
        description: `${environment} mode settings updated successfully`,
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const switchEnvironment = async (newEnvironment: 'test' | 'live') => {
    setSaving(true);
    try {
      // Update system setting
      const { error: systemError } = await supabase
        .from('system_settings')
        .update({ setting_value: JSON.stringify(newEnvironment) })
        .eq('setting_key', 'payu_active_environment');

      if (systemError) throw systemError;

      // Update is_active status for both environments
      const { error: updateError } = await supabase
        .from('payment_gateway_settings')
        .update({ is_active: false })
        .eq('gateway_name', 'payu');

      if (updateError) throw updateError;

      const { error: activateError } = await supabase
        .from('payment_gateway_settings')
        .update({ is_active: true })
        .eq('gateway_name', 'payu')
        .eq('environment', newEnvironment);

      if (activateError) throw activateError;

      setActiveEnvironment(newEnvironment);
      toast({
        title: "Success",
        description: `Switched to ${newEnvironment} mode`,
      });

      await fetchSettings();
    } catch (error) {
      console.error('Error switching environment:', error);
      toast({
        title: "Error",
        description: "Failed to switch environment",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const SettingsForm = ({ 
    settings, 
    environment, 
    onUpdate 
  }: { 
    settings: PaymentGatewaySettings | null; 
    environment: 'test' | 'live';
    onUpdate: (data: Partial<PaymentGatewaySettings>) => void;
  }) => {
    const [formData, setFormData] = useState({
      merchant_key: settings?.merchant_key || '',
      salt_32bit: settings?.salt_32bit || '',
      salt_256bit: settings?.salt_256bit || '',
      gateway_url: settings?.gateway_url || (environment === 'test' ? 'https://sandboxsecure.payu.in/_payment' : 'https://secure.payu.in/_payment')
    });

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onUpdate(formData);
    };

    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor={`${environment}-merchant-key`}>Merchant Key</Label>
          <Input
            id={`${environment}-merchant-key`}
            value={formData.merchant_key}
            onChange={(e) => setFormData(prev => ({ ...prev, merchant_key: e.target.value }))}
            placeholder="Enter merchant key"
            required
          />
        </div>

        <div>
          <Label htmlFor={`${environment}-salt-32`}>Salt (32-bit)</Label>
          <Input
            id={`${environment}-salt-32`}
            value={formData.salt_32bit}
            onChange={(e) => setFormData(prev => ({ ...prev, salt_32bit: e.target.value }))}
            placeholder="Enter 32-bit salt"
            required
          />
        </div>

        <div>
          <Label htmlFor={`${environment}-salt-256`}>Salt (256-bit) {environment === 'test' && <span className="text-gray-500">(Optional)</span>}</Label>
          <Input
            id={`${environment}-salt-256`}
            value={formData.salt_256bit}
            onChange={(e) => setFormData(prev => ({ ...prev, salt_256bit: e.target.value }))}
            placeholder="Enter 256-bit salt"
            required={environment === 'live'}
          />
        </div>

        <div>
          <Label htmlFor={`${environment}-gateway-url`}>Gateway URL</Label>
          <Input
            id={`${environment}-gateway-url`}
            value={formData.gateway_url}
            onChange={(e) => setFormData(prev => ({ ...prev, gateway_url: e.target.value }))}
            placeholder="Gateway URL"
            required
          />
        </div>

        <Button type="submit" disabled={saving}>
          {saving ? "Saving..." : "Update Settings"}
        </Button>
      </form>
    );
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            PayU Payment Gateway
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          PayU Payment Gateway Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Environment Switcher */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {activeEnvironment === 'test' ? (
              <Shield className="w-5 h-5 text-orange-500" />
            ) : (
              <CheckCircle className="w-5 h-5 text-green-500" />
            )}
            <div>
              <h3 className="font-medium">Active Environment</h3>
              <p className="text-sm text-gray-600">
                Currently using {activeEnvironment} mode
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={activeEnvironment === 'test' ? 'secondary' : 'default'}>
              {activeEnvironment.toUpperCase()}
            </Badge>
            <div className="flex items-center gap-2">
              <Label htmlFor="environment-switch" className="text-sm">
                {activeEnvironment === 'test' ? 'Switch to Live' : 'Switch to Test'}
              </Label>
              <Switch
                id="environment-switch"
                checked={activeEnvironment === 'live'}
                onCheckedChange={(checked) => switchEnvironment(checked ? 'live' : 'test')}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* Warning for Live Mode */}
        {activeEnvironment === 'live' && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <p className="text-sm text-red-700">
              You are in LIVE mode. Real transactions will be processed.
            </p>
          </div>
        )}

        {/* Settings Tabs */}
        <Tabs defaultValue="test" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="test" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Test Mode
              {testSettings?.is_active && <Badge variant="secondary" className="ml-1">Active</Badge>}
            </TabsTrigger>
            <TabsTrigger value="live" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Live Mode
              {liveSettings?.is_active && <Badge variant="default" className="ml-1">Active</Badge>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="test" className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <h4 className="font-medium text-orange-800">Test Mode Settings</h4>
              <p className="text-sm text-orange-700">
                Use these settings for testing payments. No real money will be charged.
              </p>
            </div>
            <SettingsForm
              settings={testSettings}
              environment="test"
              onUpdate={(data) => updateSettings('test', data)}
            />
          </TabsContent>

          <TabsContent value="live" className="space-y-4">
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-medium text-red-800">Live Mode Settings</h4>
              <p className="text-sm text-red-700">
                Use these settings for live payments. Real money will be charged.
                Make sure to test thoroughly before switching to live mode.
              </p>
            </div>
            <SettingsForm
              settings={liveSettings}
              environment="live"
              onUpdate={(data) => updateSettings('live', data)}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PayUGatewayManager;
