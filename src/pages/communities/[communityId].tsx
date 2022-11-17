import { type NextPage } from "next";
import Image from 'next/image';
import { useRouter } from "next/router";
import { memo } from 'react';
import { ICommunityInfo } from "../../data/interfaces";
import communityIcon from "../../images/community_icon.svg";

const mockData: ICommunityInfo = {
    community_id: 1,
    community_owner: "vself.near",
    community_name: "vSelf DAO",
    community_description: "Web3 identity wallet with for data",
    community_source_image: communityIcon,
    members: [],
    public_members: []
}

const Communities: NextPage = memo(() => {
    const router = useRouter();

    const handleNaviagte = (e: React.MouseEvent<HTMLDivElement, MouseEvent> | undefined, path: string) => {
        e?.preventDefault();
        router.push(path);
    };

    return (
        <div className="bg-white rounded-[20px] text-[#3D3D3D]">
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
                        <h1 className="text-[20px] leading-10 font-extrabold mb-[15px]">{mockData.community_name}</h1>
                        <h3 className="text-[16px] leading-5 font-normal">{mockData.community_description}</h3>
                        <div className="mt-[15px]">
                            <h5><strong>administrator:</strong> {mockData.community_owner}</h5>
                            <h5><strong>number of public:</strong> {mockData.members.length}</h5>
                            <h5><strong>private members:</strong> {mockData.public_members.length}</h5>
                        </div>
                    </div>
                    <button className="bg-[#FB40FF] text-white text-[12px] text-medium px-[50px] py-[3px] rounded-full">Share link</button>
                </div>

                <div className="text-left mt-[25px]">
                    <h1 className="text-[20px] leading-10 font-extrabold">Join community</h1>
                    <div className="flex space-x-[20px] my-[5px] items-center">
                        <div className="flex-none w-[180px] text-[16px] font-bold">
                            signed as:
                        </div>
                        <div className="flex-initial w-80">
                            <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="petya.near" />
                        </div>
                        <div className="flex-initial w-48">
                            <button
                                className="w-full main-green-bg py-[5px] rounded-full"
                                onClick={(e) => handleNaviagte(e as any, `/communities/${mockData.community_id}/join`)}
                            >
                                Join
                            </button>
                        </div>
                    </div>
                    <div className="flex space-x-[20px] my-[5px] items-center">
                        <div className="flex-none w-[180px] text-[16px] font-bold">
                            your membership key:
                        </div>
                        <div className="flex-initial w-80">
                            <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="default_random_value" disabled />
                        </div>
                        <div className="flex-initial w-48">
                            <button className="w-full main-green-bg py-[5px] rounded-full">Copy</button>
                        </div>
                        <div className="flex-initial text-[14px] w-[125px]">
                            what's memership key?
                        </div>
                    </div>
                </div>

                <div className="text-left mt-[25px]">
                    <h1 className="text-[20px] leading-10 font-extrabold">Get proof</h1>
                    <div className="flex space-x-[20px] my-[5px] items-center">
                        <div className="flex-none w-[180px] text-[16px] font-bold">
                            signed as:
                        </div>
                        <div className="flex-initial w-80">
                            <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="petya.near" />
                        </div>
                        <div className="flex-initial w-48">
                            <button
                                className="w-full main-green-bg py-[5px] rounded-full"
                                onClick={(e) => handleNaviagte(e as any, `/communities/${router.query.communityId}/join`)}
                            >
                                Get
                            </button>
                        </div>
                    </div>
                    <div className="flex space-x-[20px] my-[5px] items-center">
                        <div className="flex-none w-[180px] text-[16px] font-bold">
                            your membership key:
                        </div>
                        <div className="flex-initial w-80">
                            <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="default_random_value" />
                        </div>
                    </div>
                </div>

                <div className="text-left mt-[25px]">
                    <h1 className="text-[20px] leading-10 font-extrabold">Verify proof</h1>
                    <div className="flex space-x-[20px] my-[5px] items-center">
                        <div className="flex-none w-[180px] text-[16px] font-bold">
                            proof:
                        </div>
                        <div className="flex-initial w-80">
                            <input className="bg-[#F5F5F5] rounded-full w-full py-[5px] px-[15px]" placeholder="petya.near" />
                        </div>
                        <div className="flex-initial w-48">
                            <button className="w-full main-green-bg py-[5px] rounded-full">Verify</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
});

export default Communities;