import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send, Sparkles, Heart, Utensils, Dumbbell, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { callGeminiFlash } from '@/lib/gemini'; // Flash model call

const CoachPage = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [chatHistory, setChatHistory] = useState([
    {
      type: 'ai',
      message: "Hi! I'm your AI wellness coach specializing in PCOS/PCOD. I'm here to support you on your health journey with personalized advice, nutrition tips, exercise recommendations, and emotional support. How can I help you today? 💜",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickActions = [
    { icon: Utensils, label: "Diet Plan", color: "bg-green-100 text-green-600" },
    { icon: Dumbbell, label: "Workout", color: "bg-blue-100 text-blue-600" },
    { icon: Heart, label: "Self Care", color: "bg-pink-100 text-pink-600" },
    { icon: Sparkles, label: "Tips", color: "bg-purple-100 text-purple-600" }
  ];

  const formatMessage = (text: string) => {
    // Convert **bold** and *italic* to HTML
    const formatted = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>'); // Optional: support newlines
    return <span dangerouslySetInnerHTML={{ __html: formatted }} />;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatHistory(prev => [...prev, {
      type: 'user',
      message,
      time: currentTime
    }]);

    setIsLoading(true);

    try {
      const prompt = `You are a kind and informative AI health coach who helps girls with PCOS or PCOD. Always answer kindly and with useful, specific information.\n\nUser: ${message}`;
      const responseText = await callGeminiFlash(prompt);

      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: responseText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch (error) {
      console.error("Gemini Flash Error:", error);
      setChatHistory(prev => [...prev, {
        type: 'ai',
        message: "⚠️ Sorry, I couldn't process your request. Please try again later.",
        time: currentTime
      }]);
      toast({
        title: "Error",
        description: "Gemini Flash couldn't respond.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  const handleQuickAction = (actionLabel: string) => {
    let quickMessage = '';
    switch (actionLabel) {
      case 'Diet Plan':
        quickMessage = 'Can you suggest a PCOS-friendly diet plan for managing symptoms?';
        break;
      case 'Workout':
        quickMessage = 'What exercises are best for managing PCOS symptoms?';
        break;
      case 'Self Care':
        quickMessage = 'What self-care practices help with PCOS management?';
        break;
      case 'Tips':
        quickMessage = 'Give me some daily tips for managing PCOS symptoms naturally';
        break;
      default:
        return;
    }
    setMessage(quickMessage);
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="text-center">
        <div className="w-16 h-16 gradient-rose rounded-full mx-auto mb-3 flex items-center justify-center">
          <MessageCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gradient">AI Health Coach</h2>
        <p className="text-gray-600">Your personal PCOS wellness assistant</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <Button key={index} variant="ghost" className="h-16 flex-col space-y-2 p-2" onClick={() => handleQuickAction(action.label)}>
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${action.color}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-xs">{action.label}</span>
            </Button>
          );
        })}
      </div>

      <Card className="p-4">
        <div className="h-96 overflow-y-auto space-y-4 mb-4">
          {chatHistory.map((chat, index) => (
            <div key={index} className={`flex ${chat.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-3 rounded-2xl ${chat.type === 'user' ? 'gradient-wellness text-white' : 'bg-gray-100 text-gray-800'}`}>
                <div className="text-sm whitespace-pre-wrap">{formatMessage(chat.message)}</div>
                <p className={`text-xs mt-1 ${chat.type === 'user' ? 'text-white/70' : 'text-gray-500'}`}>{chat.time}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 p-3 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
                  <span className="text-sm text-gray-600">AI is thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex space-x-2">
          <Input
            placeholder="Ask me anything about PCOS, wellness, or your symptoms..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            className="flex-1"
            disabled={isLoading}
          />
          <Button onClick={handleSendMessage} className="gradient-rose text-white px-4" disabled={isLoading || !message.trim()}>
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="font-semibold mb-4 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-purple-600" />
          Today's Insights
        </h3>
        <div className="space-y-3">
          <div className="p-3 gradient-gentle rounded-xl text-white">
            <p className="text-sm font-medium">💡 Daily Reminder</p>
            <p className="text-xs opacity-90">Remember to take your supplements and stay hydrated! Small steps lead to big changes.</p>
          </div>
          <div className="p-3 bg-gradient-to-r from-teal-100 to-blue-100 rounded-xl">
            <p className="text-sm font-medium text-teal-800">🌟 PCOS Fact</p>
            <p className="text-xs text-teal-600">Spearmint tea may help reduce androgen levels naturally. Try 2 cups daily!</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default CoachPage;
