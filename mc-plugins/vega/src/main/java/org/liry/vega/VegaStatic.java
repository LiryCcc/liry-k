package org.liry.vega;

import org.bukkit.entity.Player;
import org.bukkit.potion.PotionEffect;
import org.bukkit.potion.PotionEffectType;

public class VegaStatic {
  public static void giveNightVision(Player p) {
    var nv = new PotionEffect(
      PotionEffectType.NIGHT_VISION,
      PotionEffect.INFINITE_DURATION,
      0,
      true
    );
    p.addPotionEffect((nv));
    p.sendMessage("you get night vision 10000000");
  }
}
