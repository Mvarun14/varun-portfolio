import avatarSrc from '../varunphoto.PNG';

export default function Avatar() {
  return (
    <span
      className="relative"
      style={{
        display: 'inline-block',
        width: 44,
        height: 44,
        verticalAlign: 'middle',
        marginRight: 12,
        transform: 'translateY(-2px)',
      }}
    >
      <img
        src={avatarSrc}
        alt="Phani Varun"
        className="block rounded-full ring-2 ring-white shadow-sm"
        style={{
          width: 44,
          height: 44,
          objectFit: 'cover',
          objectPosition: '50% 22%',
        }}
        draggable={false}
      />
      <span
        className="absolute rounded-full ring-2 ring-white"
        style={{
          width: 10,
          height: 10,
          right: 1,
          bottom: 1,
          background: '#22c55e',
        }}
      />
    </span>
  );
}
