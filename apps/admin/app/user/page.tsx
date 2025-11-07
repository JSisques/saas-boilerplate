import { Button } from "@repo/ui/components/ui/button";
import { Card, CardHeader, CardTitle } from "@repo/ui/components/ui/card";

const UserPage = () => {
  return (
    <div>
      <Button>Click me</Button>
      <Card>
        <CardHeader>
          {" "}
          <CardTitle>Card Title</CardTitle>{" "}
        </CardHeader>
      </Card>
    </div>
  );
};

export default UserPage;
