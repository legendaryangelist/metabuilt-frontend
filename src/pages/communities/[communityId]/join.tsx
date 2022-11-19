import { type NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import { memo } from 'react';
import { ICommunityInfo } from "../../../data/interfaces";
import communityIcon from "../../../images/community_icon.svg";

const mockData: ICommunityInfo = {
    community_id: "1",
    community_owner: "vself.near",
    community_name: "vSelf DAO",
    community_description: "Web3 identity wallet with for data",
    community_source_image: communityIcon,
    members: [],
    public_members: []
}

const CommunityJoin: NextPage = memo(() => {
    const router = useRouter();

    const handleNaviagte = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, path: string) => {
        e?.preventDefault();
        router.push(path);
    };

    return (
        <div className="bg-white rounded-[20px] text-[#3D3D3D] font-inter">
            <div className="px-[80px] py-[40px]">
                <div className="flex items-center gap-[50px]">
                    <div className="w-[125px] rounded-full">
                        <Image
                            layout="responsive"
                            src={mockData.community_source_image}
                            alt="community_source_image"
                        />
                    </div>
                    <div className="text-left">
                        <h1 className="text-[20px] leading-10 font-extrabold font-grotesk tracking-[0.04em] mb-[15px]">{mockData.community_name}</h1>
                        <h3 className="text-[16px] leading-5 font-normal">{mockData.community_description}</h3>
                    </div>
                </div>

                <div className="text-left mt-[25px]">
                    <div className="flex space-x-[20px] my-[15px] items-center">
                        <div className="flex-none w-[110px] text-[16px] font-bold">
                            commited:
                        </div>
                        <div className="flex-initial w-80">
                            <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="petya.near" disabled />
                        </div>
                        <div className="flex-initial w-48">
                            <button
                                className="w-full main-green-bg py-[5px] rounded-full font-medium"
                                onClick={(e) => handleNaviagte(e as any, `/communities/${router.query.communityId}/join`)}
                            >
                                Copy
                            </button>
                        </div>
                    </div>
                    <div className="flex space-x-[20px] my-[10px] items-center">
                        <div className="flex-none w-[110px] text-[16px] font-bold">
                            proof:
                        </div>
                        <div className="flex-initial w-80">
                            <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="default_random_value" disabled />
                        </div>
                        <div className="flex-initial w-48">
                            <button className="w-full main-green-bg py-[5px] rounded-full font-medium">Copy</button>
                        </div>
                        <div className="flex-initial text-[14px] w-[125px]">
                        </div>
                    </div>
                </div>

                <hr className="my-[50px]" />

                <div className="text-left mt-[25px]">
                    <div className="flex space-x-[20px] my-[15px] items-center">
                        <div className="flex-none w-[450px] text-[16px] font-bold">
                            Public membership badge or stay private?:
                        </div>
                        <div className="flex-initial w-48">
                            <button
                                className="w-full bg-[#3D3D3D] py-[5px] rounded-full font-medium text-white"
                                onClick={(e) => handleNaviagte(e as any, `/`)}
                            >
                                Stay private
                            </button>
                        </div>
                        <div className="flex-initial w-48">
                            <button
                                className="w-full main-green-bg py-[5px] rounded-full font-medium"
                                onClick={(e) => handleNaviagte(e as any, `/communities/${router.query.communityId}/claimbadge`)}
                            >
                                Claim badge
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default CommunityJoin;