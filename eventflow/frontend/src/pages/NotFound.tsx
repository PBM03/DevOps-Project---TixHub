import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Ticket } from "lucide-react";

const NotFound = () => (
  <div className="min-h-screen grid place-items-center px-6">
    <div className="text-center space-y-5">
      <div className="size-20 rounded-2xl gradient-primary grid place-items-center mx-auto shadow-glow">
        <Ticket className="size-10 text-primary-foreground" />
      </div>
      <h1 className="font-display text-7xl font-bold gradient-text">404</h1>
      <p className="text-muted-foreground max-w-sm">
        Looks like this show has ended. Let's find you something else exciting.
      </p>
      <Button asChild className="gradient-primary border-0 shadow-glow">
        <Link to="/">Back to home</Link>
      </Button>
    </div>
  </div>
);

export default NotFound;
