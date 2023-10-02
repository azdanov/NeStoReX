using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;

namespace API.TokenProviders;

public class RefreshTokenProvider<TUser> : DataProtectorTokenProvider<TUser> where TUser : class
{
    public RefreshTokenProvider(IDataProtectionProvider dataProtectionProvider,
        IOptions<RefreshTokenProviderOptions> options,
        ILogger<RefreshTokenProvider<TUser>> logger)
        : base(dataProtectionProvider, options, logger)
    {
    }
}

public class RefreshTokenProviderOptions : DataProtectionTokenProviderOptions
{
}