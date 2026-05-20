import avatarPhoto from '../../varunphoto.PNG';

export default function ChatAvatar({ size = 44, dotSize = 10 }) {
  return (
    <span
      className="relative inline-block shrink-0"
      style={{ width: size, height: size }}
    >
      <img
        src={avatarPhoto}
        alt=""
        className="w-full h-full rounded-full ring-2 ring-white shadow-sm"
        style={{ objectFit: 'cover', objectPosition: '50% 25%' }}
      />
      <span
        className="absolute right-0 bottom-0 rounded-full bg-emerald-500 ring-2 ring-white"
        style={{ width: dotSize, height: dotSize }}
      />
    </span>
  );
}
