import { BackHeader, Footer, MainLayout } from "@/shared/ui";
import { Image } from "expo-image";
import { Image as RNImage, ScrollView } from "react-native";

// Resolve the actual image dimensions so we can preserve aspect ratio
const helpImg = require("@/assets/images/img_help.png");
const { width: imgW, height: imgH } = RNImage.resolveAssetSource(helpImg);
const aspectRatio = imgW / imgH; // width / height

export default function HelpScreen() {
    return (
        <MainLayout>
            <MainLayout.Header>
                <BackHeader title="도움말" />
            </MainLayout.Header>
            <MainLayout.Content className="h-full py-0 px-0" footer={false}>
                {/* Vertically scrollable, image fills width and keeps full height via aspectRatio */}
                <ScrollView showsVerticalScrollIndicator contentContainerStyle={{ paddingBottom: 0 }}>
                    <Image
                        source={helpImg}
                        // Box width is 100%; height is computed from aspectRatio so the entire tall image renders
                        style={{ width: "100%", aspectRatio }}
                        cachePolicy="memory-disk"
                        priority="high"
                        allowDownscaling={false}
                        accessibilityLabel="도움말 이미지"
                        accessibilityRole="image"
                        transition={200}
                    />
                    <Footer />
                </ScrollView>
            </MainLayout.Content>
        </MainLayout>
    );
}

