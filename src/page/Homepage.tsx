import { Card, Typography, Button } from "antd";

const { Title, Paragraph } = Typography;

function HomePage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-white to-blue-50">
      <Card
        className="shadow-2xl rounded-2xl p-10 max-w-xl w-full bg-white text-center transform transition duration-500 hover:scale-105"
        bordered={false}
      >
        <Title level={2} className="!text-blue-600 mb-4">
          📚 Bookworld
        </Title>

        <Paragraph className="text-gray-700 text-lg">
          Chào mừng bạn đến với <b>Bookworld</b>, nơi khám phá và chia sẻ thế
          giới sách!
        </Paragraph>

        <div className="mt-6 flex justify-center gap-4">
          <Button type="primary" size="large" className="px-6">
            Khám phá sách
          </Button>
          <Button size="large" className="px-6">
            Giới thiệu
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default HomePage;
